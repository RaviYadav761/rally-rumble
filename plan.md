# Rally Rumble — implementation plan

## Scope
A browser-native, landscape-first 2D arcade fighting game inspired by the supplied video's broad match flow and festive arena mood, while keeping all characters, text, code-drawn art, and audio original.

## Product decisions
- Single-player: player versus adaptive CPU.
- Match: first to two rounds, with a 60-second timer in each round, health/Shakti meters, round markers, hit-stun and visible combo feedback.
- Inputs: A/D or arrows move, W/Up jump, S/Down crouch, hold away to block, J punch, K kick, I grab, L/Space super, Esc pause, M sound toggle. Touch uses an on-screen joystick and four action buttons.
- Hazard: a timed Sutli Bomb displays a warning before exploding, with damage and knockback for fighters that remain nearby.
- Screens: title, fighter/arena/difficulty select, fight, pause, newspaper-style match result, and replay.
- Visuals/audio: original fictional fighters, a warm night-festival arena with civic-inspired architecture, lanterns, crowd signs, rangoli and diyas, generated via canvas/CSS/Web Audio, plus optional browser text-to-speech announcements.
- No backend, login, multiplayer, database, payments, copied logos, or real-person likenesses.

## Project structure
- `index.html`: accessible game shell, round HUD, selection/results screens and touch controls.
- `styles.css`: responsive landscape-first presentation, HUD and menu styling.
- `game.js`: game state, keyboard/touch input, CPU, combat, hazards, procedural rendering and browser audio.
- `public/manus-routes.json`: route manifest for the single-page game.
- `README.md`: controls, development and customization notes.
