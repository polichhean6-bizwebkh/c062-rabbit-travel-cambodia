# Gallery stability and photo QA — 5 October 2026

## Root cause and repair
The previous implementation inserted Loading photo… into a normal-flow paragraph and hid that paragraph with display:none after image load. That changed the height of the vertically centered dialog on every slide, moving the entire frame and controls. The image stage already had a viewport-based fixed height.

The status paragraph now permanently reserves 20px and becomes invisible when empty. Photos are absolutely positioned inside the existing fixed stage, with object-fit:contain. A destination-level caption keeps the footer height constant. The previous image stays underneath while a decoded replacement fades in over 160ms; only photo opacity animates. Reduced motion disables the fade. No modal dimension or scale animation is used.

Only the current photo and immediate neighbors are preloaded after opening. There is no homepage-wide gallery preloading. A request identifier prevents an older asynchronous load from overwriting the selected slide or updating a closed modal.

## Victory Monument
Three distinct photos: existing frontal view, additional side/steps view by pisethmao (Pixabay), and sculpture detail by Bunsim San (Unsplash). The existing destination is the Win-Win Memorial, not the separate Cambodia–Vietnam Friendship Monument. Existing images retained. Photographer source/license details are in assets/images/destinations/sources.json and image-credits.html. The Unsplash localized listing explicitly names Win Win Monument. Additional WebPs: 1280×853 / 52,362 bytes and 1440×960 / 51,914 bytes.

## Browser QA
All six locations: Royal Palace, Wat Phnom, Independence Monument, Tuol Sleng, Choeung Ek and Victory Monument.

- Desktop 1440×900: 10 next + 10 previous clicks per location (120 changes total). Measured modal, stage, arrows, title and counter bounds before/after loading: zero geometry shifts. All three photos reached in every set.
- Mobile 390×844: 5 next + 5 previous taps per location (60 changes total), plus left/right pointer swipes. Zero measured geometry shifts; counters advanced and returned correctly.
- Scroll position restored exactly after closing each gallery on mobile; no horizontal overflow. All six close controls work. ESC and keyboard arrows also passed.
- Narrow 320×568 view: longest destination title and gallery fit with no horizontal overflow; visually reviewed.
- No browser console errors or warnings during checks. JavaScript syntax valid.
- All 18 configured image files decode successfully with matching dimensions. No existing images removed.
- Main homepage HTML, original style.css/main.js and existing landmark/guest images remain unchanged.
- Gesture QA used the browser pointer interface at mobile viewport sizes; not physical iOS/Android hardware.

Result: passed. Six galleries, three distinct photos each. No missing destination assets.

Changes are confined to the READY folder. No deployment performed.
