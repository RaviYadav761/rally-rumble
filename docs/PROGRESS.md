# Progress log

## Milestone 1 — reference inspection and written plan

- Inspected the full supplied 168.3-second, 1600×720 gameplay video using sampled frames and audio/text analysis.
- Inspected `https://fightkaro.com/`: game title/entry markup, canvas/loading state, audio toggle and bilingual satire notice. The in-site legal acknowledgement was not accepted.
- Inspected the existing `RaviYadav761/rally-rumble` repository. It is a browser-native 2D Canvas game with keyboard/touch combat, player-vs-CPU, two stages, fighter portraits and attributed audio.
- Wrote `docs/REFERENCE_SPEC.md`, revised `plan.md` for a 2D Canvas recreation of the video's 2.5D visual/gameplay flow, and replaced `TODO.md` with explicit outcome/acceptance criteria.
- This documentation-only milestone was pushed to `main` in commit `f6246a4`.

## Milestone 2 — interim game, UI and generated art (in progress)

- Added seven generated fictional fighter illustrations and a generated Sansar/Diwali stage image under `public/assets/`.
- Updated the select UI to a ten-character roster, Sansar/Jan Sabha/Jantar stage choices, CPU difficulty, CPU-vs-player/friend mode, rival selection and 1P/2P labeling.
- Integrated generated fighter artwork in the Canvas rendering path, custom Mbapu slam and Mitraman chakra effects, hit/round callouts, a tie-breaker for three-round matches and keyboard controls for local Player 2.
- Added the bilingual satire acknowledgement overlay and Sansad Times result actions. Card sharing is user-triggered; feedback is not transmitted and the chai action does not request payment.
- Updated README, asset licenses/credits and this progress record. Existing attributed CC BY music and source/license information for retained portrait crops remain documented. No audio was copied from memes in the reference.
- Validation completed before this interim push: `node --check game.js`, `git diff --check`, ten unique fighter IDs, all HTML image paths, required UI hooks and JS asset paths.
- **Not yet verified:** browser playthrough, every combat state/round transition, soundtrack and speech behavior, desktop/mobile visual fit, generated art consistency, or live Vercel deployment/domain mapping. This is an interim build, not a claim of pixel-perfect frame matching.

## Remaining milestones

1. Run a browser-based playthrough of CPU and friend modes; verify selection, round scoring/tie-breaks, move effects, hazard, pause, result/rematch and audio on real viewport sizes.
2. Refine assets/animation and compare the captured game states against the supplied video; check mobile/desktop UI, keyboard/touch safe areas, performance and accessibility.
3. Inspect the linked Vercel project/deployment status. Confirm repository/domain mapping before any production deployment; do not repoint `fightkaro.com` without explicit confirmation.
