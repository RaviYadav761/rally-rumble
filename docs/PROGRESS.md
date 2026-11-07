# Progress log

## Milestone 1 — reference inspection and written plan

- Inspected the supplied 168.3-second, 1600×720 gameplay video using sampled frames and audio/text analysis.
- Inspected `https://fightkaro.com/`: game title/entry markup, canvas/loading state, audio toggle and bilingual satire notice. The site's legal acknowledgement was not accepted.
- Inspected the existing `RaviYadav761/rally-rumble` repository. It is a browser-native 2D Canvas game with keyboard/touch combat, player-vs-CPU, two stages, fighter portraits and attributed audio.
- Wrote `docs/REFERENCE_SPEC.md`, revised `plan.md` for a reference-driven 2D Canvas recreation of the video's 2.5D visual/gameplay flow, and replaced `TODO.md` with explicit outcome/acceptance criteria.
- The documentation-only milestone was pushed to `main` in commit `f6246a4`.

## Milestone 2 — interim game, UI and generated art

- Added seven generated fictional fighter illustrations and a generated Sansar/Diwali stage image under `public/assets/`.
- Updated the select UI to a ten-character roster, Sansar/Jan Sabha/Jantar stage choices, CPU difficulty, CPU-vs-player/friend mode, rival selection and 1P/2P labeling.
- Integrated generated fighter artwork in Canvas rendering, custom Mbapu slam and Mitraman chakra effects, hit/round callouts, first-to-two scoring and keyboard controls for local Player 2.
- Added the bilingual satire acknowledgement overlay and Sansad Times result actions. Card sharing is user-triggered; feedback is not transmitted and the chai action does not request payment.
- Existing attributed CC BY music and source/license information for retained portrait crops remain documented. No audio was copied from memes in the reference.
- The earlier interim implementation was pushed to `main` in commit `62b5bab`.

## Milestone 3 — targeted QA and fixes (current)

- Fixed a real responsive defect: the phone-width CSS overrode the scroll treatment, hiding stage, mode and difficulty controls beneath the roster. The full selection panel now scrolls at 390×844 portrait and 844×390 landscape; the fight action is reachable at the bottom.
- Replaced the misleading `MUSIC · MEME` text with the actual selected-track label (Ragtime/Bhangra).
- Converted seven 1536×2304 transparent fighter images and the 2560×1440 stage art from PNG to quality-90 WebP. This reduces these eight assets from 28,778,640 bytes to 2,273,638 bytes (about 92% smaller); all references and credits were updated.
- Browser tests passed at 1365×900 desktop, 844×390 phone landscape and 390×844 phone portrait: legal gate, selection and scroll, match start/HUD, touch-action visibility, pause/resume, mute and local asset requests. No local page errors or failed HTTP resources were observed.
- A deterministic browser run exercised the actual match state machine with test-only health setup: two round wins to 2–0 result, feedback/no-payment messaging, rematch, friend-mode Player 2 punch mapping and soundtrack cycling all passed. The test bridge existed only in the temporary QA response and was not added to game code.
- `node --check game.js` and `git diff --check` pass.
- Vercel check: the `rally-rumble` project summary reports a READY production deployment and only `*.vercel.app` domains; the live `rally-rumble-five.vercel.app` page returns HTTP 200 but its title is still `Rally Rumble — Street Fight`, not the current `Sansad Showdown` build. `fightkaro.com` is not among the domains reported for this project. The exact Git source/commit mapping was not confirmed, so no domain was changed or claimed as deployed.
- Pushed these corrections to GitHub `main` as commit `0919b6a4f2df0c58c2f29abd05af0d925b703df7`; the remote SHA matches and the working tree is clean. Post-push, the Vercel project still reports its old READY production deployment and the public alias still serves `Street Fight`; no updated deployment appeared in the checks.
- Follow-up live browser check: all four project aliases returned HTTP 200 and served the older `Original Street Fighter Prototype` UI (title `Rally Rumble — Street Fight`). Clicking its start button reaches its older fighter-select screen; that stale build reported no browser console errors or failed network requests. The current ten-fighter Sansad Showdown changes are not what Vercel is serving.
- `fightkaro.com` is a separate live deployment: it returns HTTP 200 and its title is `Sansad Showdown — Political Satire Fighter`, but its served app does not match this repository's 2D Canvas implementation or the Vercel project mapping. In a browser session, after the satire acknowledgement and intro skip, desktop and landscape phone remained on `Loading neta assets…` for more than 12 seconds; portrait showed `Rotate your phone` and `TAP TO START` did not advance. There were no console errors or failed HTTP requests, but gameplay could not be reached. Do not report that site as successfully running or updated from this GitHub push.

## Milestone 4 — mobile combat, orientation and announcer improvements

- Replaced the static full-body fight render with a live Canvas character rig: legs articulate through stride, jump, crouch and kick; arms animate guard, wind-up, punch extension, grab, super move and hit recoil. Existing generated art is retained for head identity and selection/HUD cards.
- Added a touch-phone portrait gate before play, automatic return to landscape play after rotation, a portrait re-gate/pause during a match, safe-area touch control presentation and optional user-triggered fullscreen. Desktop is not orientation-gated. Hidden-tab fights pause and require an explicit resume.
- Added 11 original locally bundled Hindi announcer clips from one generic non-imitative voice for rounds, super moves, meme-style combo/block lines, match results and the Sutli Bomb cue. All clips decode and return HTTP 200 locally; the supplied video audio was not copied.
- Local Chromium checks passed at phone portrait/landscape and desktop sizes. A focused media-hook regression check verified the round-one clip triggers, manual and portrait pauses stop the active announcer, orientation gate hides touch input, and landscape resumes without page errors. `node --check`, `git diff --check` and the 11-clip decode check pass.
- Physical Android/fullscreen testing remains unverified.
- Pushed to GitHub `main` as `2349a42dd45e34a3ace8023d236ef58f2e67ffd0`; a post-push fetch confirmed the remote SHA matches and the working tree was clean. The exact user-supplied `https://rally-rumble-i8od.vercel.app/` URL returned HTTP 404 (`NOT_FOUND`) after the push. This repo has no `.vercel/project.json` or Vercel CLI project binding; do not claim the code is live or repoint a domain without a verified project mapping.

## Remaining work / acceptance gaps

1. Resolve the Vercel source/deployment mapping. The GitHub push did not produce a visible updated deployment. A preview deployment in the existing `rally-rumble` Vercel project would let us test this commit without changing production domains; production deployment or any domain change needs explicit approval.
2. Run a longer, manual gameplay comparison against the entire supplied video, including the hazard, every move/effect, repeated tie-break scenarios, full local two-player match and audio playback on real browser/device combinations.
3. Recheck final visual art/animation fidelity, keyboard/touch accessibility and performance on actual phones. This original Canvas adaptation is not claimed to be pixel-perfect or frame-for-frame identical.
