# Ramen Shop reference audit → Grand Slam with Lulu

Inspected public source: https://github.com/enderh3art/Ramen-Shop (main, accessed 2026-10-22).
Author case study: https://jesse-zhou.medium.com/jesses-ramen-case-study-77bae77ab5f0 (article body not accessible in this session; findings below come from code).

## Findings and application

| Source module | Observed implementation | Application to this court |
| --- | --- | --- |
| PreLoader.js | Real resource counts, staged ready/start reveal, camera and audio triggered by Start | Retain real loading; separate entering the website from choosing a player. Do not move players/camera before the role decision. |
| Camera.js | Damped controls, curated object targets, eased camera/target transitions | Coordinated 2.4-second role entrance; both players begin at the net. Preserve requested free orbit and zoom. |
| RayCaster.js | Explicit hit regions, separate mobile hitboxes, occluders included | Keep semantic accessible controls and scoreboard exclusion; navigation labels now scale with their physical air carriers rather than floating at fixed screen size. |
| World/Materials.js | Five baked light/color maps, selected matcaps, screen shaders | Added local studio reflection environment and warm/cool directional lighting; retain separate fabric, metal, skin and hair responses. This is not a complete baked-lighting replacement. |
| PostProcessing.js | Selective bloom; non-bloom objects masked | Do not apply its neon/bloom strength to this daylight tennis scene. Preserve a restrained day/night palette. |
| World/Reflections.js | Dedicated low-opacity ground reflection | A glossy wet floor does not fit an acrylic tennis court. Use soft material reflections rather than a mirror under the court. |
| World/Animations.js | Slow mechanical loops and screen transitions | Retain restrained sky motion and sparse delayed pointer clouds; pause carrier motion on hover. |
| Controller.js | Object-specific content navigation and stateful transitions | Keep Research/Writing/About/Trajectory in-site, with keyboard access and deliberate role-selection state. |

## What has not been reproduced

The restaurant assets, textures, videos, hologram, arcade, vending-machine interaction and neon signage are not copied. Full baked global illumination for the entire tennis environment remains a separate asset-production task; the changes in this release are light rigs, composition, in-world navigation and coordinated staging, not a claim of visual parity.

## Verification

Both role choices enter directly without a preliminary side swap. Players that need to cross ends travel around a net post, not through the net. Idle players and camera remain at the initial composition until role selection. Browser preview checks and reducer regression tests accompany the build.
