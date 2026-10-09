# Lulu Zhao — three website editions

- **Default / V3:** https://luluzhao.me/ — Grand Slam with Lulu
- **Version history:** https://luluzhao.me/versions/
- **V2:** https://v2.luluzhao.me/ — LuluBot Studio
- **V1:** https://v1.luluzhao.me/ — original research site
- **V0:** https://v0.luluzhao.me/ — independently hosted research portfolio

## Source layout

- `versions/v3/` contains the current default React / Three.js site and its Cloudflare configuration.
- The root `app/` remains the V2 Vinext application. Its deployment is isolated to `v2.luluzhao.me`.
- `versions/v1/` contains the archive gateway and the exported live V1 worker source. It calls the preserved original worker `lulu-zhao-personal-website` through a service binding. **Do not delete or redeploy that original worker**: its retained code and assets power V1.
- Git tag `archive/v2-before-v3` preserves the exact original V2 checkout, before the archive link and deployment identity changes.

## Develop and publish V3

```sh
npm --prefix versions/v3 ci
npm run dev:v3
npm run build:v3
npm run deploy:v3
```

V3's Worker owns `luluzhao.me`; the version-history page links to the older subdomains. Old root research / publication / about / blog / photography links redirect to their V1 equivalents.

## V2

Run `npm ci`, `npm run dev`, or `npm run deploy:v2` at the repository root. All V2 content and LuluBot interactions are retained; only its deployment name/domain and version-history footer were added.

## Preservation and rollback

Original V1 version: `505254d0-92a0-45d1-bb2d-d04299882ab1` on `lulu-zhao-personal-website`.
Current V3 production version: `5e6a8921-193e-45c9-9bb5-9692a3eee0b2` on `lulu-zhao-rally-v3`.
To restore the old homepage, reassign only the `luluzhao.me` custom domain to the original worker; keep both archive domains. Avoid deploying V2 over the original worker.

Full backup archives are saved with the task's `outputs/site-versions/` deliverables.

---

# Lulu Zhao Studio

Personal research website for Lulu Zhao (赵璐璐), a Robotics PhD student in
Cornell Computer Science working at the intersection of human–AI interaction,
design, and embodied intelligence.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal.

## Build

```bash
npm run build
```

The site is built with React, Next.js-compatible routing, vinext, and Vite.

## Content

- `app/page.tsx` — home page
- `app/research/` — research overview and project notes
- `app/publications/` — publications
- `app/about/` — background and research perspective
- `app/site.ts` — shared profile, project, and publication data
- `public/` — optimized public images and video

Original high-resolution photos and working CV files are intentionally excluded
from the public repository.

## Independent V0 hosting

V0 is deployed to `v0.luluzhao.me` on Cloudflare Worker `lulu-zhao-v0-archive`. It does not use Sites for builds, hosting, or publication. Its source and assets are in `versions/v0/`. Run `npm ci`, `npm run build`, then `npx wrangler deploy --config dist/server/wrangler.json` in that directory. The original snapshot is retained separately; the deployable copy uses its own domain and version-history footer. V1 archive responses omit the inherited X-Frame-Options: DENY header so public embedded previews can render.
