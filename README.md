# StackOrcs — Your Next Orbit

A fourteen-chapter, scroll-controlled digital odyssey for studio.stackorcs.com. The business story moves from ambition through strategy, experience, engineering, cloud, AI, security and operations into four actual projects, partnership and a new conversation.

The full script, chapter purpose, screen copy, visual direction, evidence and transitions are in [STORY_SCRIPT.md](STORY_SCRIPT.md). Longer narrative passages are the creative master; the screen presents concise copy and visual scenes. There is no prerecorded video or audio narration.

## Run and build

```sh
npm ci
npm run build
npm run dev
```

The local server defaults to http://127.0.0.1:4173. Set PORT to change it. HTML, CSS and core project interactions are served directly. Three.js and GSAP are bundled by esbuild into experience.js and versioned chunks under assets/. Run the build after changing src/; commit generated bundles along with their source. The checked-in output can be served as a static site without a platform build step.

## Story and motion

- Black curtains open through native scrolling onto an original procedural 3D rocket with the supplied bear logo, planets, stars and an orbit.
- Fourteen chapters have direct navigation, a progress indicator and a gradual rise of warm light. Visitors control the pace and can skip directly to work or contact.
- GSAP handles scene transitions and reveals. Three.js uses one canvas, a small procedural scene, capped pixel density and a 30 fps mobile / 60 fps desktop rendering target. Slow rendering lowers pixel density; hidden pages and manual pause stop continuous rendering.
- Device reduced-motion settings disable optional motion downloads. A CSS rocket remains available when WebGL is unavailable. Semantic content and links work without the enhanced scene.
- The exact original assets/StackOrcs.png supplies the header, favicon, social image and rocket decal. It is not replaced or recolored.

## Projects and contact

Actual captures show ModaStitch, Rivixa, MeetGrid and ChatSaver. Rivixa links to its website preview because a confirmed public URL was unavailable. Descriptions and links live in app.js; default project markup and image alt text live in index.html. All four previews load and decode once, remain mounted and switch without waiting for a fade or another image request. Tabs support arrows, Home and End, and direct project hashes such as /#rivixa.

WhatsApp uses https://wa.me/918303165648. Instagram and X use the stackorcs handle; LinkedIn uses the stackorcs company page. The page also links to the original StackOrcs site, its contact page, service directory and trust pages. No enquiry backend or fabricated business results are claimed.

## Publication

Source: https://github.com/StackOrcs/Profile. This change is published to GitHub only. Hosting and domain settings are managed separately; updating this repository does not imply a production deployment. The canonical URL is https://studio.stackorcs.com.

The existing static-site configuration is retained. Optional dependencies are served locally, with no runtime CDN or third-party tracking. Verification artifacts and node_modules are excluded from Git.
