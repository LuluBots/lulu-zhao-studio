# Persistent player identity — 2026-10-25

A compact lower-left tennis-broadcast-style name strap shows Lulu Zhao, CS PhD · Cornell, Human–AI Interaction, and Embodied Intelligence · Design. Four permanent navigation buttons remain available regardless of the camera angle and game state. Narrow layouts use a compact two-column ident with a single navigation row. Movement controls are moved right to avoid overlap.

The Asset credits link was removed from the main scene. Attribution remains at /credits.html and is linked from /versions/.

Previous production version: `40f70621-9aa8-46fc-aae9-2a40aa4cfdb3`.
Rollback from repository root:

```sh
./node_modules/.bin/wrangler rollback 40f70621-9aa8-46fc-aae9-2a40aa4cfdb3 --config versions/v3/wrangler.json --message "Restore pre-identity-bar release" --yes
```

Validation: production build, 56 tests, local visual inspection in night mode and navigation to About. GitHub profile README separately updated in LuluBots/LuluBots commit 213bf5ce825e49a5caacaa774bd9c6aa670d89f8.

Published version: `82e20c64-f384-4f2d-9180-a08c97277287`. Production HTML, CSS, application bundle and history page verified against the release build.
