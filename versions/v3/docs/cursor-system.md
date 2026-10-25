# Court cursor system

Four 32px SVG cursors share an ivory fill, teal stroke and sage detail. Native fallback cursors remain. Fine pointers only. CourtCursor owns the canvas cursor state, tests visible interactive scene targets before the court plane, and resets drag state on release, cancel, blur or leaving the canvas. DOM buttons/links use the same pointing hand. No custom overlay follows the pointer.

Verified live: origami crane → point, court → aim, background → grab, section text → point.
