# Cloud bookshop — local trial

Updated 2026-10-25. Supersedes the courtside-platform trial. Not published or pushed.

Restored App, Directory, styles and World from the official Git checkout; removed the unpublished CourtObjects panels and top-left COURTSIDE COLLECTION navigation. The restored CSS build matches the live index-Bt1LJP51.css resource. Online World-Dawfu9Zs.js confirms Sky_Navigation.

Only the Writing sky visitor is replaced with the Scenario bicycle bookshop on a dedicated soft cloud. Research, About and Trajectory retain daytime balloons and nighttime aircraft. The bookshop remains stationary on its cloud and follows existing overview visibility and scoreboard occlusion. No added courtside platform; court, player skeletons, rally and content retain the official baseline. Attribution is available at /credits.html.

Source: https://huggingface.co/datasets/scenario-labs/3d-collection/tree/main/assets/f5e095fbb0749c92 (Scenario, CC BY 4.0). Optimized to 32 meshes, 63,876 triangles and 5,872,792 bytes; muted canopy/bicycle colors and 512px textures. Preparation: Blender --background --python assets/blender/prepare_bookshop_trial.py -- INPUT.glb OUTPUT.glb.

Validation: production build passes; all 53 existing tests pass; daytime balloons and nighttime aircraft verified in browser; Writing opens its original directory. Both local working copy and Git checkout share identical src contents. Mobile device testing not performed.

Replaced local design backed up at ../before-cloud-bookshop-20261025-160401.tar.gz.
