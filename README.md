# Rally Rumble — Sansad Showdown

A video-based, high-fidelity approximation of the supplied satirical browser fighting game. It opens on `SELECT YOUR NETA`, defaults to Dozer Dada vs Yatra Boy, and recreates the Sansad-night stage, roster, fight HUD, live ticker/commentary, and signature bulldozer / aloo-to-sona moves. Dozer and Yatra use video-inspired full-body cutouts with timed idle/attack-pose swaps; the other fighters use the existing Canvas joint rig. This is a 2.5D Canvas remake, not the source game, a pixel-perfect reproduction, or a fully rigged 3D game.

The original playable source was not provided. The supplied `VID_20261107_224523_118.mp4` is the visual/gameplay reference; generated art and original voice clips are approximate reconstructions, not assets extracted from the video.

This is fictional political satire for entertainment. Characters, combat and announcer lines are invented; no real person, political party, government body or organization is affiliated with or endorsing the game. No real-person voice is cloned, and no unlicensed meme audio from the reference clip is bundled.

## Run locally

Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Controls

**Player 1:** `A/D` move, `W` jump, `S` crouch, hold away from the opponent to block; `J` punch, `K` kick, `I` grab, and `L` or Space for Super when the Shakti meter is full. `Esc` pauses, `M` toggles audio, and `N` switches the soundtrack.

**Local friend mode:** Player 1 uses the controls above; Player 2 uses the arrow keys to move/jump/crouch/block and `1` punch, `2` kick, `3` grab, `4` Super. This is same-device keyboard play, not online multiplayer.

**Touch:** The single-player CPU mode provides a virtual joystick and on-screen Grab, Super, Kick and Punch controls. On touch phones, portrait orientation blocks the game; rotate to landscape before starting. Returning to portrait pauses/re-gates play. Use the optional Fullscreen control to hide browser chrome where supported.

## Current game flow

Choose from ten cards, switch the roster target between Player 1 and CPU/Player 2, choose Sansad/Jantar Mantar/Desi Sadak, and pick CPU difficulty. The default match is Dozer Dada vs Yatra Boy on the Sansad stage, with 60-second rounds and first-to-two scoring. Reference-inspired Dozer/Yatra full-body images switch poses on their punch/kick active frames; movement, lean, recoil, jump and effects add motion around those 2.5D cutouts. The signature specials are the arena-crossing bulldozer and the green aloo-to-sona machine with a flying potato and falling gold bars. Original Hindi announcer lines cover round starts, specials, meme-style moments and match results. The ticker and commentary are fictional.

The result card's feedback and chai controls do not send feedback or request payment; card sharing is user-triggered. The existing attributed “Circus Theme (Ragtime Version)” by Alexander Nakarada • Julius Fučík and “Bhangra Bass” by Punch Deck remain available as locally bundled CC BY-licensed tracks. Source URLs and attribution are in [`public/assets/CREDITS.md`](public/assets/CREDITS.md).

## Assets and credits

Dozer/Yatra cutouts and pose variants, the Sansad arena, and special-move props are original generated reconstructions based on the user-supplied video frames. The Hindi announcer clips are generated from a generic non-imitative voice. Existing portrait crops and CC-licensed music retain their source/license notes in [`public/assets/CREDITS.md`](public/assets/CREDITS.md). The figures and voices are not claimed to reproduce the source game's exact 3D models or identifiable voices; no game audio was extracted from the supplied video.

## Project files

- `index.html` — satire/legal gate, fighter select, fight HUD, result flow and touch input.
- `styles.css` — full-viewport game layout, video-inspired HUD, portrait gate and touch controls.
- `game.js` — fighter state, AI/local input, combat, Canvas rendering, stages, callouts and audio.
- `docs/REFERENCE_SPEC.md` — reference video/page observations and visual/gameplay spec.
- `docs/PROGRESS.md` and `TODO.md` — implementation notes and acceptance status.
- `public/assets/` — optimized WebP art, original `audio/announcer/*.mp3`, existing portraits/music and credits.

## Deployment

The Vercel static-output configuration is in `vercel.json` (`outputDirectory: "."`). The requested production URL is [`rally-rumble-i8od.vercel.app`](https://rally-rumble-i8od.vercel.app/). After the final game-code push, the public homepage returned HTTP 200, the served `game.js` SHA-256 matched the repository exactly, the new pose/effect assets and all 12 announcer URLs returned HTTP 200, and a desktop browser reached the fight HUD without page errors. No domain was changed or repointed.
