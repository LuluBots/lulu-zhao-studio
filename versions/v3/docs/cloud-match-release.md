# Cloud Match release

Replaces human players with original Verse and Code tennis-ball sprites.

Assets: editable `assets/blender/tennis-sprites.blend`, `cloud-match.blend`; reproducible generators alongside them. Runtime GLBs are local and require no third-party image servers. Role portraits are rendered from these same 3D meshes.

Preserved: right-hand contact point, role selection, keyboard movement, pointer camera, scoring, side switching, content cards, sound controls, night/day, version history and private visitor recording.

Scene: ivory layered perimeter, lavender playing surface, sky-blue runoff, attached symmetric side terraces, upholstered benches and alternating blue/cream parasols. Four continuous-surface cloud variants plus a bounded world-space volumetric cloud layer. The artwork is adapted for real-time WebGL rather than represented by a flat concept image.

Validation: production build and 53 tests (including sprite animation/contact/identity checks). Browser checks cover entry, role choice, movement, charged shot, missed-return scoring, side switch and writing card. Deployment verification is recorded in outputs/cloud-match-release.

Rollback: Cloudflare worker `lulu-zhao-rally-v3`, previous production version `1b96d8d4-45df-4a1e-a80b-880a0d5c7eb7`. Historical v0/v1/v2 workers and domains remain independent.
