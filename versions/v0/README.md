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
