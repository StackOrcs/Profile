# StackOrcs Studio — Built with Intent

An independent, fourteen-chapter editorial experience for studio.stackorcs.com. The connected story moves from ambition and clarity through design, engineering, infrastructure, AI and trust into actual work and a direct conversation. [STORY_SCRIPT.md](STORY_SCRIPT.md) contains the narrative, business purpose, concise screen copy and creative direction for each chapter.

## Run and build

```sh
npm ci
npm run build
npm run dev
```

The server defaults to http://127.0.0.1:4173; PORT changes it. The production output is static HTML, CSS and locally bundled JavaScript. Rebuild after editing src/ and commit the generated experience.js and hashed assets alongside source. No framework migration or hosting change is needed.

## Creative system

GetLayers' [Lumora studio reference](https://www.getlayers.ai/layer/lumora) informed the large editorial wordmark, restrained palette, media-led project compositions and controlled transitions. The implementation is custom to StackOrcs; no premium template source or unrelated model is used. The original bear, actual captures and fourteen-chapter business narrative remain the substance of the experience.

- Typography and composition lead: asymmetric charcoal openings, paper editorial chapters, service rows and large real-project spreads.
- The identity completes a full scroll-driven turn, then opens its physical layers and divides into six closed pieces traced from the original logo. Six machined surfaces continue the idea: connected disciplines, stacked infrastructure, a decision network and a protective enclosure. Paired metal couplings express partnership; the 3D identity hands off at the end to the supplied black mark, which expands into a full-screen close and resolves to STACKORCS. Project chapters yield the stage entirely to their real screens. Cubic poses and time-based damping preserve movement between beats.
- Projected bounds fit only the currently visible sculptures into generous reserved stages, including on narrow phones. No canvas mask clips the geometry. Phone layouts reserve sculpture space only where a scene exists. Startup hides the fallback until it is needed, and its dimensions preserve the original square aspect ratio. Motion and scene modules download independently.
- The original PNG is unchanged as the contour source. The supplied black-background JPEG is used for the navigation, fallback, favicon and social preview. scripts/trace-brand.py derives contour geometry from the original orange pixels; src/brand-contours.json records the source hash. Beveled extrusion, chrome edges, graphite layers and photographic softbox reflections provide depth.
- GSAP creates word masks, measured entrances, scroll-controlled typography, perspective media and image reveals. Native scrolling and CSS sticky composition keep the pace under visitor control.
- Chapter 03 has its own seven-second motion score over 5.2 viewport heights of native scroll. Forty-eight closed logo ribbons and a metallic carrier field resolve into a warm orange bear, articulate a silent growl, emit three pressure fronts and settle. Outcome, people and constraints accompany the four beats. The visitor controls the actual elapsed time. Its extra 3D asset loads as the section approaches; other scenes retain their original poses. Reduced motion and the pause control collapse this interlude into its readable content. signal-config.js controls timing, distance, ribbon density, articulation, wave radius and framing; verify-signal.mjs checks isolation, reverse scrubbing and geometry containment.
- Fine-pointer devices use an exact-outline bear cursor, a VIEW action on project screens, and a heart at WhatsApp. Touch, keyboard navigation, text controls, share dialogs and reduced motion retain normal input. Cursor updates are event-driven, without a continuous render loop.
- Three.js renders on demand. It stops when nothing changes, when its scene is absent, when the page is hidden or motion is paused. Pixel density is capped and adapts to slow rendering. Both desktop and mobile target 60 fps while changing. Device reduced-motion settings skip optional animation downloads; semantic content works independently.

## Editable direction

src/config.js holds reveal timing, easing, scrub, scroll follow, perspective, camera FOV/position, timed stage bounds, exposure, density, scale, separation and poses. src/director.js controls actor hand-offs; src/forms.js defines the four business formations and partnership sculpture; src/brand.js defines the original identity and fragment movement. CSS variables hold colors and typography. Add ?tune=1 for opt-in controls; save chosen values back to the config. On phones, stage.js follows dedicated scene space so geometry stays clear of copy and controls.

The modules separate orchestration, timelines, text masks, media interaction, cursor, actor geometry, scene direction, camera containment, controls and configuration. Business content and the four individual projects remain semantic HTML. app.js handles sharing and legacy project hash aliases. The build slices the source contours offline using polygon-clipping; that library is not included in the browser bundle. Run node scripts/verify-framing.mjs for camera containment, pose velocity, scene hand-offs, invisible actor bounds and exact fragment-area regression checks.

## Work and contact

Actual captures show ModaStitch, Rivixa, MeetGrid and ChatSaver once each in their own editorial chapter. Rivixa was visited through its current local website export from vivekgotstack/Rivixa commit 9f96734 on 6 October 2026. Its fresh homepage capture shows the scientist-and-laboratory design and current nine-product ophthalmology catalogue. Rivixa links to that capture because a confirmed public URL was unavailable. Four unique previews preload without a redundant switcher. Legacy project hashes such as /#rivixa still resolve to the relevant chapter.

WhatsApp: https://wa.me/918303165648. Instagram and X use stackorcs; LinkedIn uses the StackOrcs company page. Main-site, contact, service and trust links remain direct. No invented client statistics or performance outcomes are presented.

## Publication

Repository: https://github.com/StackOrcs/Profile. Canonical: https://studio.stackorcs.com. This revision is pushed to GitHub only; Vercel settings and deployment are separate. Verification artifacts and node_modules remain outside Git.
