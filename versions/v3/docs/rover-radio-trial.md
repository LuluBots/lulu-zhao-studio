# Tennis court: research rover and radio

Local trial, 2026-10-25. No publishing or Git push. Previous local src and credits preserved in ../before-rover-radio-20261025-161437.tar.gz.

The Research balloon/aircraft is replaced by a stationary 3.3m rover on a small cloud. It shares the same cloud component and cream/sage palette as Writing. Clicking the rover triggers its one-shot mechanical-arm animation and opens Research without delaying navigation; reduced-motion preference suppresses the animation. The existing Research label opens the directory immediately. About and Trajectory remain unchanged.

A 0.9m radio sits on a small table within the original rest terrace, x=6.95, z=0. No court extension or additional navigation board. Its button cycles Off → Court sounds → Soft music → Off. Audio is generated locally, starts only after selection, follows global mute, and silences while the tab is hidden. Closing or replacing the station stops/disconnects the previous source; late async starts cannot restart a switched-off radio. The radio controls are visible in overview only.

Sources (Scenario, CC BY 4.0):
- Rover: https://huggingface.co/datasets/scenario-labs/3d-collection/tree/main/assets/580dedba0aa2f076
- Radio: https://huggingface.co/datasets/scenario-labs/3d-collection/tree/main/assets/scenario_asset_dNe4icRacz1xDsSLFaHxM1A1

Optimized rover: 97,214 triangles, 30 meshes, seven animation clips retained. Optimized radio: 26,932 triangles, one mesh; texture resolution reduced to 512px. Rover orange accents converted to muted tennis yellow; chassis cream and gray-blue. Attribution added to public credits. Rebuild assets with Blender --background --python assets/blender/prepare_court_props.py -- ROVER.glb RADIO.glb OUTPUT_DIRECTORY.

Validation: production build; 54 tests pass including audio mute, visibility, off cleanup and canceled async starts; browser verified default composition, daytime/nighttime, clicking rover into Research, radio station cycling and mute status. A hover-layout issue was fixed so radio status text no longer shifts the button hit target. Mobile physical-device and subjective listening checks remain unverified.
