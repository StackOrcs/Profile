# StackOrcs — one-page showcase

A compact, independent showcase for `https://studio.stackorcs.com`.

## Run locally

`npm run dev` serves the page at `http://127.0.0.1:4173`.

Plain HTML, CSS and JavaScript; self-hosted Manrope; no runtime dependencies or external trackers. CSS and SVG provide the restrained motion. Reduced-motion preferences are respected.

## Content

Project copy and links live in `app.js`. The default ModaStitch content is also in `index.html` for a useful first render without JavaScript. Change both if updating the default project.

- ModaStitch and MeetGrid: captures of the live public sites.
- Rivixa: capture of the actual built frontend in the existing local Rivixa repository. A full-size preview is linked because a confirmed public company URL was unavailable.
- ChatSaver: capture of the actual public application.
- StackOrcs: the exact supplied orange bear mark with its original colors. No invented customer counts, revenue claims, testimonials or delivery metrics.

Tabs support arrow keys, Home and End. Project hashes (for example `/#rivixa`) open the selected project directly. Sharing preserves the selected project and supports native share, clipboard and a selectable link fallback.

## Contact

Project contact opens `https://stackorcs.com/contact`. Direct email uses `info@stackorcs.com`, the public branded sender in the existing StackOrcs source. LinkedIn and the original site are linked directly. No unfinished enquiry backend is presented as functional.

## Deploy

Source repository: https://github.com/StackOrcs/Profile.

The Vercel project is `stackorcs-onepage` in `vivekgotstacks-projects`. It builds from the root of this standalone repository. Deployments currently use the Vercel CLI. Automatic Git deployments require the Vercel GitHub App to have access to `StackOrcs/Profile` in the organization's GitHub settings.

Run `npx vercel --prod --yes` from this folder. `.vercelignore` excludes credentials, verification files, scripts and original capture PNGs. The shipped page includes optimized WebP project previews. Header, favicon and social previews use the exact supplied StackOrcs.png logo without color filters.

The production fallback is https://stackorcs-profile.vercel.app.

The custom domain `studio.stackorcs.com` is attached to this project and ownership is verified. Use the exact DNS target shown by Vercel in the active DNS zone. The project CNAME target is:

| Type | Name | Target |
| --- | --- | --- |
| CNAME | studio | 3f7f9d210260a13e.vercel-dns-017.com |

Use the provider's default TTL. The active nameservers are `apollo.dns-parking.com` and `athena.dns-parking.com`. Add the record in the DNS zone served by those nameservers; a record in an inactive registrar DNS zone will not resolve. After propagation, run `npx vercel domains verify studio.stackorcs.com --scope vivekgotstacks-projects`. The page and social preview use the intended custom domain.

Public production checks returned HTTP 200 for the page and social image, and the production browser rendered the expected project and contact controls.

## Verification

The showcase passed browser checks for four project tabs and image loads, keyboard navigation, project deep links, clipboard sharing, 320–1920px layouts, reduced motion, contact targets, and no JavaScript or missing-resource errors. Generated screenshots and workstation-specific capture scripts are retained locally outside the repository. Production has no runtime dependencies.
