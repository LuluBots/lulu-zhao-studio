# Rally — Verse & Code

## Current behavior
- Website title, metadata, visible UI, logo subtitle, favicon and package name use Rally. Original directories and historical deliverables retain their paths.
- Verse is the Humanities persona; Code is the Technology persona. YOU follows the near-end identity; NPC follows the far-end identity. Switching ends keeps the court and camera fixed.
- Baseline centers carry luluzhao signatures. Positive-z end is unrotated; negative-z end rotates by pi, so an observer outside each end reads toward the court. Four surrounding prints use Lulu’s stated fun facts: sports, Djokovic, living near a court, invitation to play.
- Scoreboard width reduced from 8.05 to 4.25 world units. Both board faces are canvas textures on real depth-tested meshes, not HTML overlays. They are positioned outside the player corridor behind each baseline. Expanded scorecards are user-opened dialogs.
- WASD moves the racket across x/z; diagonals are normalized and bounded. S backs up in Rally; S remains the overview shortcut for switching. Touch controls duplicate movement. Losing focus, opening a dialog, or exiting clears movement keys.
- Arrow keys or right-drag adjust bounded yaw/pitch. Touch users can drag the upper sky. Center view resets orientation.
- A shot starts at the moved racket. The NPC returns into a deterministic lane derived from target and shot count. A subtle ground ring indicates the required lateral receiving position. Collision uses swept relative racket-plane intersection, not a forced return to the visitor’s position.
- The visitor scores only after catching and returning into the opposite court. Misses, initial out-balls and returned out-balls score for the NPC. Return direction includes the visitor’s look angle. An in-bounds return opens the next content card; failed shots remain playable without a modal.
- Both initial and returned landings use the court’s x/z boundaries. Replay and cancellation cannot score twice. Existing 0/15/30/40/deuce/game scoring remains.
- Aircraft and balloons follow bounded peripheral routes, with a three-unit hull/wing clearance outside the full platform. Overview provides the airborne navigation; Rally keeps the playing view free of these carriers. Hover pauses navigation motion. Reduced-motion disables ambient travel.
- Navigation and cards use local athletic condensed italic font stacks; no remote font service is required. Sky entries still open internal courtside notes.

## Verification
Production build and 29 automated tests pass. New tests cover normalized WASD, movement/look bounds, swept hit/miss/high-ball cases, deterministic incoming lane, moved launch origin, in/out classification, full-route craft clearance, and signature orientation.
Desktop browser: stationary racket missed and awarded NPC; three D presses positioned the racket to receive, resulting in YOUR POINT and the article card. The score advanced from NPC 15 / visitor 0 to 15 / 15. S and W did not switch identity. Clicking x≈5.33 on the opposite apron was classified OUT and awarded NPC. Perspective screenshot confirms the smaller board is beside the NPC and no longer overlays the character.

This is a deterministic lightweight tennis interaction, not a full competitive tennis simulation. Real-device performance, serving rules, sets and tournament match rules remain outside this iteration. Existing vendor-size build warning remains.

Mobile viewport: 390×844 sky navigation opens Writing internally. Development hot reload interrupted WebGL during testing; context listeners now clean up with the scene so disposed canvases do not leave stale callbacks. A recovery button is available for genuine context loss. Physical-device performance is still unverified.

The Rally camera follows the visitor’s x/z movement with a constant three-unit trailing distance, keeping the racket visible near court edges on portrait screens. A compact live score remains readable on narrow screens. The camera does not rotate or exchange court ends when the personas swap.
