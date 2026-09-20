# Mobile media polish for ZeroHours

Goal: keep the desktop site exactly as it is, and make every image and video on phones feel designed for a phone — big, readable, and never a shrunken widescreen strip floating in empty space.

Note: every current screenshot and the demo video are widescreen recordings of the desktop app. Cutting them into a tall portrait shape would slice off parts of the app UI, so on phones each one keeps its full picture but sits inside a taller, intentional card with a caption underneath. Slots are added so you can upload true portrait versions later and they will be used automatically.

## What changes

### One reusable media block
A single new media component handles every image and video on the page. Per item it accepts:
- desktop file and optional mobile file (falls back to desktop when empty)
- desktop shape and mobile shape
- focus point for any image that is safe to crop
- optional caption

All images and the video are switched over to it, so swapping in a mobile asset later is a one-line change in the config file, not a layout rewrite.

### Phone treatment
- Each visual becomes a large rounded card that fills the phone width with comfortable side margins, subtle shadow, and a short caption.
- The picture inside stays complete — no important app UI is cut.
- The card is tall enough that the screenshot reads large rather than as a thin strip; leftover space is styled as part of the card, not blank page.
- Screenshots stack vertically, one per screen, never side-by-side.

### Hero
On phones the order becomes headline, supporting line, buttons, then the product visual — the visual sized to dominate the screen. Desktop keeps its current arrangement.

### Demo video
- Desktop: unchanged widescreen player.
- Phone: a prominent card with the same full video, controls on, no sound autoplay, plus the existing expand button.
- A separate mobile video slot is added; upload a vertical cut later and phones will use it in a 9:16 player automatically.

### Showcase gallery
Stays a grid on desktop. On phones it becomes a clean vertical stack of large screenshot cards each with its one-line explanation, instead of the current side-swipe row.

### Spacing and sticky button
Tighter but even vertical rhythm between headline, copy, media and buttons on phones. The sticky bottom buy button gets safe-area padding so it clears the phone's home bar and never sits over video controls.

## Testing
Checked at 375x812, 390x844, 414x896, 768x1024, 1024x768, 1280x800, 1440x900 for: no sideways scrolling, no tiny or stretched screenshots, no cropped app UI, no large blank gaps, nothing overlapping or spilling out of its card.

## Technical notes
- New `src/components/ResponsiveMedia.tsx`: props `desktopSrc`, `mobileSrc?`, `desktopRatio`, `mobileRatio`, `objectPosition?`, `caption?`, `kind: 'image' | 'video'`; breakpoint chosen with CSS (`<picture>`/`source media`) so there is no layout shift or JS check.
- `src/lib/zerohours-config.ts`: `marketingAssets` and `showcaseShots` entries gain optional `mobileSrc` and per-asset ratio fields; `productConfig` gains `demoVideoMobileUrl` (empty string = fall back to `demoVideoUrl`).
- Uncropped screenshots use `object-contain` centered on a card-tinted backdrop inside the taller mobile frame; only assets explicitly marked croppable use `object-cover` with `objectPosition`.
- `src/routes/index.tsx`: replace the five inline `aspect-video` image/video blocks and the showcase figure markup with the component; no copy, pricing, funnel, or route changes.
- `src/styles.css`: add media-card utilities and safe-area padding for the sticky CTA.
- Supersedes the earlier "16:9 everywhere on mobile" rule; memory will be updated to this new direction.
