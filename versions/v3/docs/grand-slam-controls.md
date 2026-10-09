# Grand Slam with Lulu — courtside welcome

The court is visible immediately. A compact corner invitation shows the event title and Start. Start expands the invitation and reveals navigation without an overlay or modal. Reduced-motion preferences suppress the expansion animation.

## Controls
- Left-drag orbits in both overview and Rally. Shift-left-drag pans. Wheel / trackpad pinch zooms toward the cursor.
- Moving more than eight screen pixels cancels a pending shot. A stationary click or hold-and-release on the far court hits; modified clicks do not charge shots.
- Overview zoom is limited to 0.7–2.2 times the fitted scale. Rally orbit distance is limited to 9–32 scene units, with a minimum camera height of 4.2 units above court level. The orbit target stays inside the court surrounds; the same guard handles pan, zoom and orbit.
- In idle overview, WASD / arrows move the visible racket across the full court: x ±5.7, z ±10.2. Entering Rally returns to a serving position; live play uses the near half. Equivalent keys do not double movement speed.
- Bottom navigation contains only actions. The ? control reveals short instructions when needed.

## Courtside details
Each right-side bench has four 0.17-unit square supports, foot plates and cross bracing, meeting the deck and seat. Each retains its own parasol. The umpire seat is moved out to x −7.25, z 0.9 with its platform, leaving clearance from the net post at x −5.05.

Four baseline inscriptions highlight gently on hover, without tooltips or dialogs:
- 🏠 I literally live right next to the tennis courts.
- 🎾 Want to hit sometime? Let's rally!
- 🐐 Team Djokovic all the way. GOAT!
- 🛹 I'm into plenty of other sports too!

## Verification
Production build and 35 automated tests pass, including extreme repeated wheel / trackpad pinch zoom bounds, cursor anchoring, full-court idle movement and scoring. Browser checks cover initial visible court, Start expansion, left drags without accidental shots in both modes, and compact layouts.

Run locally: npm run dev

## Latest revision — watermark and embodied player
The initial invitation is unboxed and transparent, over the bare court. Start mounts the players, match interaction, scoreboards and courtside furniture; it removes the invitation. Sky navigation becomes visible after Start.

Both modes now render the complete visitor model holding its own attached racket. Keyboard movement updates the player root and plays running / shuffle steps. The separate floating racket has been removed. Reception samples the animated Racket_Contact node in world space, including its height. Rally uses an elevated third-person entry view to keep the visitor visible.

Overview maximum zoom is now 6 times the fitted scale (previously 2.2); Rally minimum orbit distance is 5 units. Height and target bounds remain in place. The north cloud cluster was lowered and moved out; flight routes moved farther away. Clouds and air navigation are hidden when their projected footprint overlaps either scoreboard, including after camera rotation.

Final validation: production build and 37 tests passed. Browser inspection verified bare-court welcome, post-Start population, complete visitor in Rally and keyboard movement.
On small viewports, the overview zoom cap is at least 180 camera-zoom units so baseline lettering remains readable; the overview pan target extends through the scoreboards (x ±8.5, z ±13), rather than stopping at the playing lines.


## Current camera and typography
Restored the isometric orbit overview and elevated third-person Rally camera at the user’s request. Left-drag rotates, Shift-drag pans, cursor-anchored zoom retains its expanded range and safety bounds. Scoreboards stand upright again. The refined sans-serif typography and rounded Start button are retained.

## Role selection and calmer sky
Every overview entry to Rally (Play, tennis ball, court click, Enter, or Rally from a card) now opens a native modal choosing Verse or Code. Cancel stays in overview; selection assigns the chosen identity to the visitor, performs a side swap if needed, then enters the Rally camera without auto-serving. Browser verification confirms the visitor/opponent labels after selection.

Removed visitor-facing CV provenance and editorial overview notes. Cloud occlusion checks run four times a second; disappearance transitions over roughly 0.8 seconds and restoration waits 1.5 seconds, then takes about 2.9 seconds. Sky carriers travel at one-quarter of their previous animation speed.
