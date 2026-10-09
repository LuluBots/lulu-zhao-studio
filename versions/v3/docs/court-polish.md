# Court interaction refinement — 2026-10-08

- Rebuilt Blender grip from 0.18 m to 0.32 m, lengthened open throat, added butt cap and repositioned palm/fingers. First-person racket uses matching longer proportions. Racket contact marker remains aligned with the existing ball return.
- Replaced movement-only leg playback with distance-driven cross-step targets and two-bone leg IK. The stance phase keeps ankles at ground height; recovery lifts/crosses the foot. Lowered moving pelvis, counter-rotated ankles, and retained neutral contact during the swing.
- Visitor now receives the complementary identity. Both sides retain one Humanities and one Technology character.
- Added scene-anchored directional signs, hover/focus feedback, Research/Writing/About dialogs, direct verified links, Play/Switch/Reset actions, and contextual Rally controls. Content remains editable in src/content/profile.ts. Mobile signs use a compact two-column arrangement beneath the court.

Validation: production build passed; 19 automated tests passed, including actual exported-rig ankle grounding, contact alignment and repeated identity swaps. Browser checked Research/Writing dialogs, switched identities and a completed Humanities rally. Narrow viewport inspected at 390×844. Browser lost its WebGL context during live editing/resizing; reloading restored it. Real-device mobile performance and deployment remain pending. Three.js bundle-size warning remains.
