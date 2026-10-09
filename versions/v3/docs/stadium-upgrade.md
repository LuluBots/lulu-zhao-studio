# Stadium & sky upgrade — 2026-10-08

## Implemented
- Two fixed, double-sided baseline scoreboards at (−5.2, 0, −11.6) and (5.2, 0, 11.6). Each displays Humanity / Tech, Lulu’s identity, current game and point scores. A shared score state updates both simultaneously.
- Original LZ tennis monogram and Lulu Zhao wordmark: public/brand/lulu-zhao.svg. Tournament-inspired framing; no official AO branding or affiliation.
- Swapping ends moves the two persistent character instances around the sidelines. Court, net, sky, scoreboards and camera remain fixed. Identity and score do not swap. The first-person viewpoint remains at the visitor end, with the opposing identity changing.
- Friendly rally scoring: completed returns award the receiver one point; 0/15/30/40, deuce, advantage and game progression. This is an exploration rally, not a complete match simulation; manual switching remains available between rallies. Sets, serve faults and tournament-mandated changeover timing are not simulated.
- Auto lighting follows browser-local time: daylight 07:00–18:59, moonlight otherwise, checked once per minute. Auto/Day/Night overrides in upper right.
- Day balloons and night aircraft carry Research/Writing/About entry buttons. Hover pauses the relevant craft; reduced-motion disables movement.
- Those entries now open on-site overviews/notes from the already verified profile content. No redirect to the old website. Full paper/article bodies have not been migrated.
- Removed baseline tulips and the remaining flower planter; retained the small courtside tree. Added hard-court grain, perimeter accents and “For the love of tennis / Inspired by Novak Djokovic” baseline markings.
- Tennis-themed content cards. Ball landing is projected from world space at bounce time; its screen position anchors the completed-rally card. Resize and edge clamping keep it visible. Sky cards anchor to their clicked button.

## Verification
Production build and 23 tests passed, including scoring, deuce, identity preservation, automatic time boundaries, existing flight/rig validation.
Browser: fixed-camera swap visually checked; completed rally changed Humanity 0→15→30; two different targets opened cards at x≈488 and x≈808 on a 1280×800 viewport. Research and About opened internal content. 390×844 About dialog stayed within viewport (x22/y151, 352×677) with zero external links. Day/night sky and controls inspected.

Limitations: desktop browser viewport testing is not physical mobile-device performance testing. Existing vendor chunk size warning remains. The development preview can require a reload after repeated hot updates.

References consulted for design/rules: https://www.itftennis.com/en/about-us/organisation/tennis-glossary/ and https://ausopen.com/visit/tournament-info/venue . The implementation’s casual scoring is explicitly distinguished from full official match rules.
