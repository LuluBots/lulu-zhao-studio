# Player screen and radio refinement

Radio model scale 0.58; table radius reduced from 0.58 to 0.40. Removed synthesized chord music. On-demand menu links to STONE MUSIC official Aloha MV (Hospital Playlist OST): https://www.youtube.com/watch?v=3DOkxQ3HDXE. External playback, not in-court streaming; court sound toggle still respects global mute and hidden tabs.

Reviewed Scenario metadata and all 696 unique-input preview groups (1,342 model variants). No suitable stadium portrait screen found; arcade cabinets were visually unsuitable. External reference found: https://www.innerscene.com/tools/library/3d-parts/scoreboard-sports-equipment-12d80980 (CC0), not downloaded or used.

Implemented original lightweight mesh screen with tennis furniture palette, twin supports and existing cloud perch. Uses existing public/photos/lulu-portrait.jpg with a canvas crop; source photo unchanged. This is custom website geometry, not a Scenario model. Replaces About balloon/aircraft and preserves About navigation, reduced-motion behavior, and scoreboard occlusion.

Validation: production build and 54 tests pass. Browser checked portrait, radio link destination, About navigation and day/night rendering. No deployment.
