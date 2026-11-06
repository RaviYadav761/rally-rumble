# Rally Rumble — Sansad Showdown

A reference-driven update to the existing browser-native 2D Canvas fighting game. The current interim pass adds a Sansar/Diwali arena, a ten-fighter character-select roster, locally generated cartoon fighter art, signature-move effects, a local two-player keyboard option, and a bilingual fictional-satire notice. This is still a work in progress; visual frame matching, browser gameplay, mobile layout, and hosted deployment have not yet received final verification.

The supplied gameplay clip was reviewed as the visual/gameplay reference. The public `fightkaro.com` page and the existing `RaviYadav761/rally-rumble` repository were inspected, but the implementation remains a separate update inside this repository; it does not reuse the public game's bundled code or claim a pixel-perfect match.

This is a fictional parody for entertainment. Characters, combat and announcer lines are invented; no real person, political party, government body or organization is affiliated with or endorsing the game. No real-person voice is cloned, and no unlicensed meme audio from the reference clip is bundled.

## Run locally

Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Controls

**Player 1:** `A/D` move, `W` jump, `S` crouch, hold away from the opponent to block; `J` punch, `K` kick, `I` grab, and `L` or Space for Super when the Shakti meter is full. `Esc` pauses, `M` toggles audio, and `N` switches the soundtrack.

**Local friend mode:** Player 1 uses the controls above; Player 2 uses the arrow keys to move/jump/crouch/block and `1` punch, `2` kick, `3` grab, `4` Super. This is same-device keyboard play, not online multiplayer.

**Touch:** The single-player CPU mode provides a virtual joystick and on-screen Grab, Super, Kick and Punch controls. Landscape orientation is recommended for the 16:9 arena.

## Current game flow

Choose one of ten fighters, select the rival/player two, choose the Sansar, Jan Sabha Maidan or Jantar Plaza arena, and select CPU difficulty. CPU matches use 60-second rounds and first-to-two scoring, with a three-round tie-break rule. The build includes generated character sprites, move/hit effects, the Sutli Bomb hazard, browser-voice/synthesized callouts, and a Sansad Times results screen. The authored results actions do not submit feedback or request payment; the chai button is a no-payment joke, and card sharing is user-triggered.

The existing attributed “Circus Theme (Ragtime Version)” by Alexander Nakarada • Julius Fučík and “Bhangra Bass” by Punch Deck remain available as locally bundled CC BY-licensed tracks. Their source URLs and attribution are listed in [`public/assets/CREDITS.md`](public/assets/CREDITS.md).

## Assets and credits

New fictional fighter sprites and the Sansar stage illustration were generated specifically for this game. Existing portrait crops and the two music tracks retain their source/license information in [`public/assets/CREDITS.md`](public/assets/CREDITS.md). The cartoon sprites are stylized game art and are not depictions or endorsements by the real people referenced by the satire.

## Project files

- `index.html` — title and legal-gate UI, fighter selection, game HUD, results, and touch input.
- `styles.css` — title, selection grid, HUD, responsive layout, results and touch controls.
- `game.js` — fighter state, AI/local input, combat, Canvas rendering, stages, callouts and audio.
- `docs/REFERENCE_SPEC.md` — reference video/page observations and visual/gameplay spec.
- `docs/PROGRESS.md` and `TODO.md` — milestone notes and acceptance checklist.
- `public/assets/` — generated stage/fighter art, existing portraits/music and credit notes.

## Deployment

The interim update is pushed to the `main` branch. A GitHub push does not guarantee a public deployment: verify the linked Vercel project and production-domain mapping before reporting hosted status or changing any production domain. No deployment or domain repoint has been performed as part of this interim push.
