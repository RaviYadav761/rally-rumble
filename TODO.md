# Rally Rumble — video-based close remake TODO

## User-approved target

Recreate the supplied 3D-looking browser fighting game as closely as practical from its video, without claiming pixel-perfect identity or exact voice cloning. The original playable source is not available. Reference details are in [`docs/REFERENCE_SPEC.md`](docs/REFERENCE_SPEC.md). Keep mobile landscape gating, desktop keyboard play, working combat and lag-conscious rendering.

## Acceptance checklist

- [x] **Start/selection flow:** keep the satire notice, then open `SELECT YOUR NETA` directly. On a touch phone in portrait, the rotate prompt blocks the game; after landscape, the prompt closes and does not repeat unless the phone rotates back.
- [x] **Reference roster and defaults:** show `MITRAMAN`, `YATRA BOY`, `DEDEE`, `TARIFF TAIL`, `DOZER DADA`, `TOLL MAN`, `SUTTI BABU`, `RAIL RAJA`, `MBAPU`, `RANDOM`; default 1P Dozer Dada vs CPU Yatra Boy, Sansad stage, Normal difficulty. Keep card clicks and CPU selection functional.
- [x] **Selection screen composition:** large centered title/instructions, two facing full-body previews with a central `VS`, 10 horizontal cards along the bottom, stage/difficulty/friend options and one fight/loading action. Avoid the previous card-grid-plus-newspaper style.
- [x] **Sansad arena:** use a close curved Parliament colonnade, side crowds/signs, flags and colorful hanging lights, checkerboard perspective floor and large multicolor rangoli, drawing from the real sample's frame. Other choices remain labeled Jantar Mantar and Desi Sadak.
- [x] **Battle HUD/scene:** edge-to-edge 16:9 viewport; long angled player/CPU health bars and names at the top; 60-second center timer, pause button, portrait/round indicators, Shakti meters/readiness, lower `LIVE / BREAKING BAKWAS` vs `TROLL ARMY` mini panel and scrolling red satire ticker.
- [x] **Combat/poses:** retain responsive movement/CPU/rounds; make punch, kick, block, grab, hit recoil, airborne knockback, fall and victory poses readable on phone landscape and desktop. Use user-video-inspired 2.5D artwork and animations honestly; no claim of full 3D rigging.
- [x] **Sample specials:** Dozer's `DOZER KA DHAMAKA` includes a readable bulldozer entry/impact; Yatra's `ALOO → SONA` includes a machine and falling gold bars. Add clear action names and match the reference's pacing without copying the video soundtrack.
- [x] **Rounds/results:** announce Round 1/2, show timer resets and arena-integrated round/result text, with a large `YOU LOSE`/winner pose and working rematch/character-select actions.
- [x] **Audio:** original generic Hindi/Hinglish narrator clips for round starts and signature specials, plus light fight impacts/crowd feel. Reference video audio is not bundled and no identifiable real voice is cloned.
- [x] **Performance/responsiveness:** touch-safe controls, usable desktop keyboard, portrait gate/landscape resume, optional fullscreen, frame delta cap and no console errors in local browser smoke checks.
- [ ] **Publish and verify:** push the final build to GitHub and confirm the exact Vercel production URL serves it. Local syntax, desktop/mobile-browser flow, special-move rendering, and new-asset HTTP checks passed. Physical Android validation has not been performed.

## Verified local evidence

Desktop Chromium completed selection → loading → fight → pause/resume → two rounds → result with no page errors or failed requests. Portrait touch emulation displayed the rotate gate and hid touch controls; rotating to landscape removed the gate and enabled touch controls once play began. Dozer's bulldozer and Yatra's machine/potato/gold-bar specials were visually checked. New pose, stage, special-effect and announcer assets returned HTTP 200 locally.

## Known fidelity boundary

Video-only recreation can match composition, copy, timing, stage cues and move concepts closely. The uploaded ZIP was a site guide page rather than the game source; it did not contain rigged 3D models or original animations. Pixel-perfect 3D models and identical real voices are not claimed. If a new complete source/asset archive becomes available, replace approximations with those assets.
