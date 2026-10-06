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
- WebGL serves two directed scenes: a material portrait of the original bear identity and an exploded-layer design sequence. The subject rotates around one anchor. No particles or unrelated space assets are included.
- The actual PNG is unchanged. scripts/trace-brand.py derives contour geometry from its orange pixels; src/brand-contours.json records the source hash. Beveled extrusion, chrome edges, graphite layers and photographic softbox reflections provide depth.
- GSAP creates word masks, measured entrances, scroll-controlled typography, perspective media and image reveals. Native scrolling and CSS sticky composition keep the pace under visitor control.
- Three.js renders on demand. It stops when nothing changes, when its scenes are absent, when the page is hidden or motion is paused. Pixel density is capped and adapts to slow rendering. Targets are 60 fps desktop / 30 fps mobile while changing. Device reduced-motion settings skip optional animation downloads; semantic content works independently.

## Editable direction

src/config.js holds reveal timing, easing, scrub, perspective, camera FOV/position, exposure, density, scale, separation and directed poses. CSS variables hold colors and typography. Add ?tune=1 to the local preview URL for opt-in sliders; save chosen values back to the config. The panel is absent by default and does not persist changes.

The modules separate orchestration (experience), timelines (motion/editorial), text masks (text), media interaction (media), physical scene (scene), controls and configuration. Business content remains semantic HTML; project data lives in app.js. This is a static site, not a single large framework component.

## Work and contact

Actual captures show ModaStitch, Rivixa, MeetGrid and ChatSaver. Rivixa links to its captured website because a confirmed public URL was unavailable. All four previews load, decode once and stay mounted for immediate switching. Tabs support arrows, Home and End; project hashes such as /#rivixa remain shareable.

WhatsApp: https://wa.me/918303165648. Instagram and X use stackorcs; LinkedIn uses the StackOrcs company page. Main-site, contact, service and trust links remain direct. No invented client statistics or performance outcomes are presented.

## Publication

Repository: https://github.com/StackOrcs/Profile. Canonical: https://studio.stackorcs.com. This revision is pushed to GitHub only; Vercel settings and deployment are separate. Verification artifacts and node_modules remain outside Git.
