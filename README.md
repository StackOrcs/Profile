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
- WebGL continues through all fourteen chapters. The original bear turns, separates its physical layers and reassembles in a longer craft sequence, stays beside the service chapters, becomes a small margin signature around actual project media, and returns at partnership and contact. Unevenly timed cubic poses and time-based damping preserve motion across chapter boundaries. The craft sequence keeps the front identity visible rather than parking on an empty reverse side.
- Projected assembly bounds fit a reserved stage at every angle, including on narrow phones; no canvas mask clips the relief. Every phone chapter has its own physical scene space. The normal startup hides the static fallback until it is actually needed, and its image dimensions preserve the original square aspect ratio. Motion and scene modules download independently.
- The actual PNG is unchanged. scripts/trace-brand.py derives contour geometry from its orange pixels; src/brand-contours.json records the source hash. Beveled extrusion, chrome edges, graphite layers and photographic softbox reflections provide depth.
- GSAP creates word masks, measured entrances, scroll-controlled typography, perspective media and image reveals. Native scrolling and CSS sticky composition keep the pace under visitor control.
- Three.js renders on demand. It stops when nothing changes, when its scene is absent, when the page is hidden or motion is paused. Pixel density is capped and adapts to slow rendering. Both desktop and mobile target 60 fps while changing. Device reduced-motion settings skip optional animation downloads; semantic content works independently.

## Editable direction

src/config.js holds reveal timing, easing, scrub, time-based scroll follow, perspective, camera FOV/position, timed stage bounds, exposure, density, scale, separation and directed poses. Each shot has an editable chapter position and pose; craft has extra beats at 3.20, 3.42, 3.60 and 3.82. CSS variables hold colors and typography. Add ?tune=1 to the local preview URL for opt-in sliders; save chosen values back to the config. The panel is absent by default and does not persist changes. On phones, stage.js follows dedicated space in every chapter so the sculpture stays clear of copy, controls and project images.

The modules separate orchestration (experience), timelines (motion/editorial), text masks (text), media interaction (media), physical scene (scene), camera containment and cubic poses (framing), controls and configuration. Business content remains semantic HTML; project data lives in app.js. Run node scripts/verify-framing.mjs for camera containment and pose-velocity regression checks. This is a static site, not a single large framework component.

## Work and contact

Actual captures show ModaStitch, Rivixa, MeetGrid and ChatSaver. Rivixa was visited through its current local website export from vivekgotstack/Rivixa commit 9f96734 on 6 October 2026. Its fresh homepage capture shows the scientist-and-laboratory design; a versioned filename avoids old cached imagery. Its showcase now describes the current nine-product ophthalmology catalogue. Rivixa links to that capture because a confirmed public URL was unavailable. All four previews load, decode once and stay mounted for immediate switching. Tabs support arrows, Home and End; project hashes such as /#rivixa remain shareable.

WhatsApp: https://wa.me/918303165648. Instagram and X use stackorcs; LinkedIn uses the StackOrcs company page. Main-site, contact, service and trust links remain direct. No invented client statistics or performance outcomes are presented.

## Publication

Repository: https://github.com/StackOrcs/Profile. Canonical: https://studio.stackorcs.com. This revision is pushed to GitHub only; Vercel settings and deployment are separate. Verification artifacts and node_modules remain outside Git.
