# Credits

| Asset | File | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| Diorama playbook + code kit | `src/kit/*`, `qa/*`, `build.mjs` | https://github.com/sloemo01/diorama @ `077f604` | Nehal Kanak (sloemo) | MIT |
| three.js | `node_modules/three` 0.187.0 | https://threejs.org | three.js authors | MIT |
| Storefront reference photography | `../assets/labay/**` | LABAY Market | — | owned by the client |

No third-party models, textures, HDRIs or animation clips were imported. Every
object in the scene is hand-built from primitives against the reference above.

## Edits made to kit modules

| Module | Change | Why |
| --- | --- | --- |
| `post.js` | composites onto **cobalt `#0451AB`**, not white paper | The brief puts the scene in a saturated cobalt page. The kit's white surround and empty-paper rules do not govern this website. |
| `palette.js` | rebuilt on STIR's four colour roles with tonal steps | The brief fixes the palette; the kit's 64 generic entries do not apply. |
| `camera.js` | kept as-is (az 45, elev 33, fov 20.5 are kit invariants) | — |
