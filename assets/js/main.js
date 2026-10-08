'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
const tours = {
  history: {title:'Killing Field Tour', eyebrow:'HISTORY & HERITAGE', meta:'$20 / person · Approximately 4 hours · Entrance and audio-guide fees not included', content:'<p>Discover one of the most important chapters of Cambodia’s modern history on a guided half-day journey through Tuol Sleng Genocide Museum (S-21) and the Choeung Ek Killing Fields. With a local guide who has a personal connection to this period of Cambodian history, the tour offers context, stories and insight that help visitors understand not only what happened, but how Cambodia and its people endured and rebuilt.</p><p><em>A meaningful historical experience for travelers who want to understand Cambodia beyond the landmarks.</em></p><h3>Choose your departure</h3><ul><li>Morning: 8:00 AM – 12:00 PM</li><li>Afternoon: 1:20 PM – 5:30 PM</li></ul><h3>Your tour includes</h3><ul><li>English-speaking guide</li><li>Car, van, or bus transport</li><li>Pick-up and drop-off</li></ul><h3>Not included in the $20/person tour price</h3><ul><li>Entrance fees and audio-guide fees are not included.</li></ul><p>These memorial sites address difficult history. Allow time for quiet reflection.</p>', select:'Killing Field Tour'},
  city: {title:'Phnom Penh Highlight City Tour',eyebrow:'A DAY OF DISCOVERY',meta:'$30 / person · Full day · 8:00 AM – 5:00 PM',content:'<p>Discover the many sides of Phnom Penh, from the Royal Palace and Silver Pagoda to Wat Phnom and the Independence Monument. Visits to Tuol Sleng and Choeung Ek offer a deeper understanding of Cambodia’s history, while a Buddhist monk blessing introduces a living spiritual tradition.</p><h3>Places and experiences</h3><ul><li>Wat Phnom</li><li>Royal Palace and Silver Pagoda</li><li>Independence Monument</li><li>Tuol Sleng Museum and Killing Field</li><li>Buddhist monk blessing</li></ul><p>The order of stops and blessing availability can be discussed when planning your day. Ask us to confirm the full-day tour’s inclusions.</p>',select:'Phnom Penh Highlight City Tour'},
  food: {title:'Street Food in Phnom Penh City',eyebrow:'TASTE THE LOCAL LIFE',meta:'Starts at 5:30 PM · Price and duration on request',content:'<p>See another side of Phnom Penh as the evening begins. With hotel pickup by TukTuk at 5:30 PM, explore Cambodian traditional food and street food for a taste of everyday local life.</p><h3>An evening to savor</h3><ul><li>Discover Cambodian traditional food</li><li>Explore Cambodian street food</li><li>Travel through the city by TukTuk</li></ul><p>Tell us about dietary requirements when you inquire. We’ll confirm the menu, duration, price, and inclusions before you book.</p>',select:'Street Food Tour'}
};
const dialog = document.querySelector('#tour-dialog');
document.querySelectorAll('[data-tour]').forEach(button => button.addEventListener('click', () => {
  const tour = tours[button.dataset.tour];
  document.querySelector('#dialog-content').innerHTML = `<span class="eyebrow">${tour.eyebrow}</span><h2 id="dialog-title">${tour.title}</h2><p class="dialog-meta">${tour.meta}</p>${tour.content}<button class="button" id="inquire-tour">Ask About This Tour</button>`;
  dialog.showModal();
  document.querySelector('#inquire-tour').addEventListener('click', () => { dialog.close(); selectInquiry(tour.select); });
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) { const box=dialog.getBoundingClientRect(); if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom) dialog.close(); } });
function selectInquiry(value) { const select=document.querySelector('#tour'); if(select) {select.value=value; document.querySelector('#form-status').textContent=''; document.querySelector('#contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); document.querySelector('#name').focus({preventScroll:true});} }

document.querySelectorAll('[data-inquiry]').forEach(button=>button.addEventListener('click',()=>selectInquiry(button.dataset.inquiry)));
document.querySelectorAll('[data-footer-inquiry]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#tour').value=link.dataset.footerInquiry;}));
const form=document.querySelector('#inquiry-form');
const dateInput=document.querySelector('#date');
const today=new Date();
dateInput.min=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const formStatus = document.querySelector('#form-status');
const submitButton = form.querySelector('.submit-button');
const failureMessage = 'Sorry, we could not send your inquiry. Please contact us directly by <a href="mailto:rabbittravelcambodia@gmail.com">Email: rabbittravelcambodia@gmail.com</a>, <a href="tel:+85517818555">Telegram: 017 818 555</a>, or <a href="https://wa.me/85517818555" target="_blank" rel="noopener">WhatsApp: +855 17 818 555</a>.';
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  formStatus.classList.remove('error');
  formStatus.textContent = 'Sending your inquiry…';
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(form.action, {method: form.method, body: new FormData(form), headers: {Accept: 'application/json'}});
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) throw new Error('Form submission failed');
    form.reset();
    formStatus.textContent = 'Thank you! Your inquiry has been sent successfully. Rabbit Travel Cambodia will contact you soon.';
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.innerHTML = failureMessage;
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
  }
});
form.addEventListener('input',()=>{formStatus.textContent='';formStatus.classList.remove('error');});
const gallery=document.querySelector('#gallery-dialog');
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#gallery-image').width=Number(button.dataset.width);document.querySelector('#gallery-image').height=Number(button.dataset.height);document.querySelector('#gallery-image').src=button.dataset.gallery;document.querySelector('#gallery-image').alt=button.dataset.caption;document.querySelector('#gallery-caption').textContent=button.dataset.caption;gallery.showModal();}));
gallery.querySelector('.dialog-close').addEventListener('click',()=>gallery.close());
gallery.addEventListener('click',event=>{if(event.target===gallery){const box=gallery.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)gallery.close();}});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');observer.unobserve(entry.target);}});},{threshold:.12});document.querySelectorAll('.section-heading,.tour-card,.transport-panel,.about-copy,.center-heading').forEach(element=>observer.observe(element));}
