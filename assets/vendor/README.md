# Vendored three.js

The only third-party code in this repository. Vendored — not loaded from a CDN — so the
site works offline and never calls a third party while you read (Zakon lepote, član 7:
„rad bez CDN-a i bez mreže"; SVEMIR kanon: bez novih npm zavisnosti).

| File | SHA-256 | Source |
|---|---|---|
| `three.module.min.js` | `e2b5ee6bccd38fd6d8a2428546b83c5f2426d84b152ef82be8055556e3b40eb6` | `https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js` |
| `three.core.min.js` | `61ba0df005b05991361d040d8ff670e1aadfd0ce7aeebd1fdb0725957a8957de` | `https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.core.min.js` |

- Version: **0.180.0** (reported `REVISION` 180), downloaded 2026-10-09.
- License: MIT (SPDX header preserved at the top of both files, Three.js Authors).
- Import path used by the site: `import * as THREE from './vendor/three.module.min.js'`.
- To upgrade: download both files from the same release, update the hashes above, run
  `node --test tests/` — `tests/cover.test.mjs` fails if a hash above stops matching the file.

Why three.js and not a lighter medium: the cover page shows the workbook as a real lit
stack of A3 sheets — depth, light and the settling of a sheet are the scene's job. Every
other page stays DOM/SVG. The canvas is an enhancement: without JavaScript, without WebGL
or with `prefers-reduced-motion`, the static composition below it is the page.
