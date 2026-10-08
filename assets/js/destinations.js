'use strict';
(() => {
  const modal = document.querySelector('#destination-dialog');
  const stage = modal.querySelector('.destination-stage');
  const photo = modal.querySelector('.destination-image');
  const title = modal.querySelector('#destination-title');
  const caption = modal.querySelector('.destination-caption');
  const counter = modal.querySelector('.destination-counter');
  const status = modal.querySelector('.destination-status');
  let destination, current = 0, opener, pagePosition = 0, pointerStart;
  let priorBodyStyle, priorScrollBehavior;

  // Keep the previous photo visible until its replacement has decoded.
  const previousPhoto = photo.cloneNode(false);
  previousPhoto.className = 'destination-image destination-image-previous';
  previousPhoto.alt = '';
  previousPhoto.setAttribute('aria-hidden', 'true');
  stage.prepend(previousPhoto);
  const imageCache = new Map();
  let requestId = 0, fade;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function loadPhoto(item) {
    if (!imageCache.has(item.src)) {
      const image = new Image();
      image.decoding = 'async';
      image.src = item.src;
      const ready = image.decode().then(() => image).catch(error => {
        imageCache.delete(item.src);
        throw error;
      });
      imageCache.set(item.src, ready);
    }
    return imageCache.get(item.src);
  }

  function preloadNeighbors() {
    const photos = destination.photos;
    const nearby = [-1, 0, 1].map(offset => photos[(current + offset + photos.length) % photos.length]);
    const keep = new Set(nearby.map(item => item.src));
    for (const src of imageCache.keys()) if (!keep.has(src)) imageCache.delete(src);
    nearby.forEach(item => { loadPhoto(item).catch(() => {}); });
  }

  async function showPhoto(index) {
    current = (index + destination.photos.length) % destination.photos.length;
    const item = destination.photos[current];
    const id = ++requestId;
    status.textContent = 'Loading photo…';
    stage.setAttribute('aria-busy', 'true');
    counter.textContent = `${current + 1} / ${destination.photos.length}`;
    // A destination-level caption keeps the footer height identical across slides.
    caption.textContent = destination.caption;
    try {
      await loadPhoto(item);
      if (id !== requestId || !modal.open) return;
      fade?.cancel();
      if (photo.hasAttribute('src')) previousPhoto.src = photo.src;
      else previousPhoto.removeAttribute('src');
      photo.alt = item.alt;
      photo.width = item.width;
      photo.height = item.height;
      photo.src = item.src;
      if (!reducedMotion.matches) {
        fade = photo.animate([{opacity: 0}, {opacity: 1}], {duration: 160, easing: 'ease-out'});
        fade.finished.then(() => {
          if (id === requestId) previousPhoto.removeAttribute('src');
        }).catch(() => {});
      } else {
        previousPhoto.removeAttribute('src');
      }
      status.textContent = '';
      stage.setAttribute('aria-busy', 'false');
      preloadNeighbors();
    } catch {
      if (id !== requestId || !modal.open) return;
      stage.setAttribute('aria-busy', 'false');
      status.textContent = 'Photo unavailable. Try another photo.';
    }
  }

  document.querySelectorAll('.landmark-open').forEach(button => {
    button.addEventListener('click', () => {
      destination = window.rabbitDestinationGalleries[button.dataset.destination];
      if (!destination || !destination.photos.length) return;
      modal.querySelectorAll('.destination-prev, .destination-next').forEach(control => {
        control.disabled = destination.photos.length < 2;
      });
      opener = button;
      pagePosition = window.scrollY;
      priorBodyStyle = document.body.getAttribute('style');
      priorScrollBehavior = document.documentElement.style.scrollBehavior;
      // Preserve the exact page position, including on mobile browsers.
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      Object.assign(document.body.style, {position:'fixed', top:`-${pagePosition}px`, left:'0', right:'0', overflow:'hidden', paddingRight:`${scrollbar}px`});
      title.textContent = destination.name;
      photo.removeAttribute('src');
      previousPhoto.removeAttribute('src');
      modal.showModal();
      showPhoto(0);
    });
  });
  modal.querySelector('.destination-close').addEventListener('click', () => modal.close());
  modal.querySelector('.destination-prev').addEventListener('click', () => showPhoto(current - 1));
  modal.querySelector('.destination-next').addEventListener('click', () => showPhoto(current + 1));
  modal.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const bounds = modal.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
  });
  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('button') || !event.isPrimary || event.button !== 0) return;
    pointerStart = {x:event.clientX, y:event.clientY, id:event.pointerId};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) showPhoto(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { pointerStart = null; });
  modal.addEventListener('close', () => {
    ++requestId;
    fade?.cancel();
    imageCache.clear();
    pointerStart = null;
    if (priorBodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', priorBodyStyle);
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({top:pagePosition, behavior:'instant'});
    opener?.focus({preventScroll:true});
    document.documentElement.style.scrollBehavior = priorScrollBehavior;
  });
})();
