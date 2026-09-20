# ZeroHours marketing site and sales funnel

## Goal
Build a mobile-first, production-quality sales page that makes ZeroHours feel like a credible $29.99 product and moves social visitors through problem recognition, product understanding, purchase, and delivery without invented proof or features.

## Page experience
- Replace the placeholder home page with one continuous sales narrative: clean navigation, product-led opening, problem, ZeroHours method, four-step workflow, product showcase, outcome-based feature groups, academic workspace, transformation, audience fit, free guide, pricing, FAQ, final call to action, and footer.
- Preserve the supplied headlines and positioning while tightening supporting copy to avoid repetition and keep the page from feeling oversized.
- Use a warm off-white, white surfaces, charcoal text, ZeroHours indigo, and restrained coral accents with geometric Sora-style headings and highly readable body text.
- Add subtle reveal and interaction motion with reduced-motion support, strong focus states, semantic structure, and keyboard-accessible controls.
- Design every section for phone visitors first, especially 375–414px screens, then progressively expand the composition for tablet and desktop.
- Prioritize short mobile reading blocks, full-width calls to action, touch-friendly controls, readable product imagery, and fast access to the purchase path.
- Build a compact mobile menu and tasteful sticky mobile purchase bar that never obscures content; desktop remains polished but secondary to the phone experience.

## Honest product presentation
- Create polished, clearly labeled media placeholders for the hero, problem, transformation, feature showcase, logo, and application screens; no fake product UI or stock imagery.
- Centralize all asset references so the final files can be swapped in once without changing page markup.
- Group existing features by the outcomes Start, Focus, Catch Up, Manage School, and Understand Yourself rather than presenting a feature dump.
- Include an empty testimonial-ready component in code, but do not render fake testimonials, ratings, usage numbers, urgency, or scarcity.
- Present the Study Pack, Exam Rescue Pack, and Complete Student Bundle only as disabled future-offer configuration. They will not be advertised as available.

## Checkout and delivery
- First build the accurate product page and pricing content, then rerun payment eligibility and present the recommended supported provider for approval before enabling payments.
- After approval, create a real hosted checkout for the $29.99 one-time ZeroHours purchase. The site will never collect card or billing details itself.
- Centralize product IDs, prices, checkout settings, guide settings, and future offer flags in one configuration module.
- Add success and cancellation states, payment verification, and idempotent purchase handling.
- Deliver the purchased ZeroHours HTML package by email through a secure download link. App emails do not support file attachments, so the HTML will not be attached directly.
- Keep future cross-sell, post-purchase upgrade, and bundle hooks isolated and disabled until their products and files actually exist.

## Free guide
- Build the single-field email capture with an explicit “not connected yet” state rather than pretending submissions succeed.
- Keep the free guide secondary to ZeroHours and isolate its future email-service/download integration.
- When the guide file and email setup are available, delivery will use an emailed download link rather than a PDF attachment.

## Measurement and discoverability
- Add a provider-neutral analytics adapter for `page_view`, `free_guide_click`, `free_guide_submit`, `pricing_view`, `checkout_click`, `faq_open`, and `feature_interaction`; it remains a safe no-op until a provider is connected.
- Add the requested page title and description plus Open Graph, Twitter card, canonical metadata, semantic headings, meaningful alt text, favicon handling, and structured product information where accurate.

## Validation
- Verify navigation, mobile menu, all active calls to action, disabled/unavailable states, guide form, FAQ behavior, focus order, image fallbacks, scrolling, and reduced-motion behavior.
- Validate 375, 390, and 414 pixel layouts first, including real touch-target sizes, one-handed CTA access, no horizontal overflow, and no sticky-bar collisions; then verify 768, 1024, 1280, and 1440 pixel layouts.
- Confirm checkout success/cancel behavior and delivery only after the payment provider and product are enabled.

## Inputs still needed before launch
- Final ZeroHours logo, symbol, hero image, problem image, transformation image, feature image, and real application screenshots.
- The downloadable ZeroHours HTML package and free-guide PDF.
- Confirmation of whether the app requires an account, exact browser/device support, and which updates purchasers receive.
- Payment account approval and live-mode activation after the provider recommendation is rerun.
- An email domain/service connection for purchase and guide delivery.
