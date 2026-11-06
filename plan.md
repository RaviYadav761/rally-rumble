# Rally Rumble — implementation plan

## Scope
A browser-native, landscape-first 2D fighting game inspired by the interaction pattern of the supplied reference, without copying its characters, branding, text, artwork, or proprietary assets.

## Product decisions
- Single-player: player versus CPU.
- Screens: title, fighter/stage/difficulty select, fight, pause, result.
- Controls: A/D or arrows move, W/up jump, S/down crouch, opposite direction blocks, J punch, K kick, I grab, L/Space super, Esc pause.
- Mobile: on-screen directional and attack controls.
- Visuals: original procedural vector fighters and a neon street-rooftop stage, designed to remain replaceable with a user-provided sprite later.
- No server, login, multiplayer, database, or payment dependency.

## Project structure
- `index.html`: accessible shell, canvas, HUD, menus, touch controls.
- `styles.css`: responsive landscape layout, typography, HUD and menu styling.
- `game.js`: state machine, input, fighters, CPU logic, combat, drawing, audio feedback.
- `public/manus-routes.json`: route manifest for the single-page game.
- `README.md`: controls, development and customization notes.

## Implementation notes
The game uses a single HTML canvas for deterministic rendering and plain JavaScript so the deployment has no build dependency. Fighter art is drawn from reusable vector functions (`drawFighter`) and can later be replaced by sprite-sheet rendering without changing combat state. The combat loop keeps state separate from rendering and uses bounded timers for attacks, hit-stun, blocking, super meter and round results.
