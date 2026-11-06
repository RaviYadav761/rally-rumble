# Rally Rumble — implementation plan

## Scope

Continue the existing vanilla HTML/CSS/Canvas fighter in `RaviYadav761/rally-rumble`. Keep the established best-of-three player-versus-CPU combat loop and mobile controls, and refresh the presentation to better match the user-authorized `fightkaro.com` reference while keeping Rally Rumble’s own identity and code. The exact user-supplied video was not present in the workspace, so no frame-by-frame video match can be claimed; use the public reference site and the user’s written requirements.

## Product and implementation decisions

- Preserve the current static, browser-native Canvas architecture; no new framework, account, backend, multiplayer service, or paid runtime is needed.
- Expand the selectable roster with Narendra Modi, Rahul Gandhi, and Akhilesh Yadav, retaining Shanti Sage and Kesar Kaka. Use accurate portraits from Wikimedia Commons / Government of India sources for visible likeness; do not generate real-person lookalikes. Keep the actual character sprites as playful, clearly satirical game art, not realistic depictions. Fighter names, colors, special-move labels, and CPU selection derive from one roster list.
- Add a short satire notice stating that the game is fictional, its scenarios/announcer lines are invented, and it is not affiliated with the people portrayed. Do not clone political figures’ voices; use the existing browser speech feature and synthesized arcade SFX.
- Replace the procedural-only arena backdrop with two generated 16:9 illustrations: a dramatic fictional legislative arena and a festive night plaza. Continue drawing floor, crowd accents, fighters, hazards, and fight effects in Canvas so foreground gameplay stays readable.
- Add a small music selector with two sourced instrumental options: “Circus Theme (Ragtime Version)” by Alexander Nakarada • Julius Fučík for a comedic/meme-like cue (CC BY 4.0), and “Bhangra Bass” by Punch Deck for Indian action energy (CC BY 3.0). Bundle local audio files and visible/README credit details; retain the master sound toggle and start playback only after a user gesture.
- Keep movement, block, jump, four attacks, touch joystick, on-screen action buttons, pause, round scoring, Sutli Bomb, and result flows working. Improve touch target spacing, portrait/landscape behavior, and roster scrolling/selection at narrow widths.
- Test a local static preview and inspect desktop plus mobile layouts. Push the verified source/assets to the existing `main` branch of `RaviYadav761/rally-rumble`. The repository currently has no GitHub Pages site; do not invent a hosting path or deploy to `fightkaro.com` without the user’s deployment instructions.

## Design

**Direction:** Midnight political arcade—festival poster art meeting an old-school 2D fighting-game HUD.

**Core principles:** (1) Recognizable but clearly satirical roster; (2) low-clutter arena contrast so sprites and attack effects stay legible; (3) bold, readable controls on desktop and phone; (4) locally bundled, attributed sound and imagery.

**Color philosophy:** Keep the existing ink/navy base, warm saffron/gold highlights, and teal/pink accent colors. Darken the generated image under UI surfaces rather than flattening its atmosphere.

**Layout paradigm:** Poster-like title screen; scrollable fighter-selection roster with the CPU rival called out separately; HUD pinned to the top corners; touch actions anchored to safe lower corners.

**Signature elements:** Double-outline health/Shakti bars; warm paper/civic-stage motifs; custom painted lantern-lit arenas with moving 2D fighters and impact bursts.

**Interaction and animation:** Preserve short decisive attacks, smooth movement and hitstun, focused menu selection, distinct active-state highlights, and tap-friendly controls. Respect reduced-motion preferences already present.

**Typography system:** Continue the existing bold system sans for HUD/buttons and serif newspaper treatment for results; reserve uppercase display text for short labels.

**Brand essence:** A bright, playful India-themed arcade brawler for quick solo matches; personality: energetic, cheeky, festive.

**Brand voice:** Keep announcer copy clearly fictional and playful; examples: “ROUND 1 — TAIYAAR HO?” and “RING SE BHAAGO!”

**Wordmark and signature color:** Retain the angular “RR” monogram and the saffron-gold `#f4ca68` as the signature Rally Rumble color.

## Project structure

- `index.html`: title, satire notice, roster/arena/difficulty selection, HUD, results, pause, music and touch controls.
- `styles.css`: arcade theme, responsive layout, roster cards, HUD, mobile safe-area and reduced-motion rules.
- `game.js`: game state, fighter roster and image loading, keyboard/touch input, CPU, combat, stage backgrounds, hazards, Canvas rendering and browser audio.
- `public/assets/`: generated arena images, locally bundled licensed portrait/audio files, and `CREDITS.md`.
- `README.md`: run instructions, controls, soundtrack selection, asset credits, and deployment notes.
- `public/manus-routes.json`: single-page route manifest; keep unchanged unless routes change.
