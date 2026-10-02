# Phone showcase without losing the desktop media

## Goal
Keep the existing desktop screenshots and walkthrough video in the ZeroHours showcase. On phones, show a separate three-phone carousel instead. This gives each screen size its own presentation without replacing or cropping the desktop files.

## What changes
- Leave the current six-image desktop gallery and walkthrough video intact, visible on tablet/desktop. Keep the existing product details and buy button.
- Add a reusable PhoneMockup for the mobile showcase: a CSS/SVG titanium-style frame, highlight edge, rounded 9:19.5 screen, Dynamic Island, side buttons, home indicator and soft shadow. It accepts an image or video and an optional caption. The screen fills with `object-fit: cover` once a portrait file is supplied.
- Put three editable entries together at the top of the new showcase component (`type`, `src`, `poster`, `caption`). For now, leave their media sources empty as requested and show deliberate, distinct placeholder screens, **not** the uploaded screenshots. Use these captions exactly:
  1. “Tell it what you're avoiding. Get one tiny next step.”
  2. “Lock in with a focus timer.”
  3. “Panic mode: exam in 3 days? Here's your plan.”
- On phones, allow a finger-swipe carousel that centers one phone at a time, snaps to each phone, and updates three small position dots. On desktop, the PhoneMockup showcase layout supports three phones across with a slightly larger, raised middle phone, but the current desktop gallery/video remains the visible desktop presentation.
- For future video slots, use muted looping inline playback without controls, preload metadata, show an optional poster, start only while visible, and pause when scrolled away; lazy-load images and defer video loading until near view. Respect reduced-motion preference.
- Make the section introduction accurate for both presentations without mentioning how the site or app was built.

## Checks
- Confirm existing desktop images and video remain unchanged, phone placeholders are visible only on mobile, captions and dots match the active phone, no sideways page overflow, and the purchase button still works.
- Test narrow phones, tablet, and desktop; check image/video behavior with a temporary test source without shipping that source in the placeholders.

## Technical notes
- Keep separate responsive render branches for the current desktop showcase and new mobile PhoneMockup carousel; don't pass wide desktop screenshots into the portrait phones.
- Confine the new styles to semantic global design tokens and showcase-specific classes. Reuse the existing mobile breakpoint and avoid changing other media sections.
