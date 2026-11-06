# Rally Rumble

Rally Rumble is a browser-native 2D festival fight game with a best-of-three player-versus-CPU match, selectable fighters and arenas, a Shakti meter, and the timed Sutli Bomb hazard. The updated roster keeps the original fictional fighters (Shanti Sage and Kesar Kaka) and adds satirical game representations of Narendra Modi, Rahul Gandhi, and Akhilesh Yadav using locally bundled, credited portrait assets. Two original generated 16:9 arenas provide the background art while Canvas continues to draw the fight, HUD, impacts, and hazards.

This is a fictional satire/parody. Its combat, announcer lines, and scenarios are invented. No person, political party, photographer, source site, Government of India, or music creator endorses or is affiliated with the game. No real-person voice is cloned.

## Run locally

Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Controls

On desktop, use `A/D` or the arrow keys to move, `W` or Up to jump, `S` or Down to crouch, and hold away from the opponent to block. Press `J` to punch, `K` to kick, `I` to grab, and `L` or Space for Super when the Shakti meter is full. Press `Esc` to pause, `M` to toggle audio, and `N` to switch between the two background tracks.

On touch screens, use the virtual joystick and the on-screen Grab, Super, Kick, and Punch buttons. Landscape orientation is recommended for the current 16:9 fighting arena.

## Game flow and audio

Select a player fighter, cycle the CPU rival, choose Jan Sabha Maidan or Jantar Plaza, and set CPU difficulty. Matches have 60-second rounds and first-to-two scoring. The game includes CPU blocks/counters, timed bomb warnings/explosions, Hindi/browser-voice calls, and synthesized arcade hit effects. Start music after a user gesture with the Enter Arena or soundtrack button; the top-right audio control mutes both tracks and sound effects.

The default soundtrack is the comedic “Circus Theme (Ragtime Version)” by Alexander Nakarada • Julius Fučík. Press `N` or click the music button for “Bhangra Bass” by Punch Deck. Both are CC BY-licensed tracks bundled locally and credited in the game’s asset disclosure and [`public/assets/CREDITS.md`](public/assets/CREDITS.md).

## Asset credits

The generated arena art was created for Rally Rumble. Portrait and music authors, source URLs, license links, attribution text, and the WebP/MP3 conversion notes are in [`public/assets/CREDITS.md`](public/assets/CREDITS.md). Reuse each third-party asset in accordance with its listed license.

## Project files

- `index.html` — game shell, roster, audio/credits controls, HUD, results, and touch input.
- `styles.css` — title art, menus, HUD, responsive layout, and touch controls.
- `game.js` — fighter state, AI, combat, Canvas rendering, stage images, input, voice calls, and audio.
- `public/assets/` — optimized arena art, portraits, music tracks, and credits.

## Deployment

This repository currently has no GitHub Pages configuration. Run the local preview above or connect the repository to the hosting provider used for the desired public site; do not assume that a GitHub push automatically deploys to `fightkaro.com`.
