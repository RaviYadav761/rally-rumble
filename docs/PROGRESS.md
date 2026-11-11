# Rally Rumble — progress

## 2026-11-10 — reference pose, local QA and public release

- Added four optimized transparent WebP pose assets: Dozer idle/punch and Yatra idle/kick. Dozer switches to the attack silhouette during the punch's active timing window; Yatra switches to the extended kick silhouette during the kick's active window. Other fighters retain the Canvas joint rig.
- The Dozer bulldozer and Yatra aloo-to-sona supers were visually checked in Chromium. Yatra's sequence shows the custom green machine, potato and falling gold bars. Generated props and pose cutouts are shipped as optimized WebP rather than multi-megabyte PNG intermediates.
- Added the locally bundled `aloo-sona.mp3` cue; there are 12 original generic Hindi clips for round starts, specials, meme-style cues, warnings and results. No real-person voice is cloned and no source-video audio is copied.
- Desktop Chromium passed selection → loading → fight → pause/resume → two round wins → result. The test verified the default Dozer Dada vs Yatra Boy selection, all four pose images loaded, and no browser exceptions or failed requests.
- Touch-phone emulation verified that portrait displays the rotate gate and hides touch controls; after switching to landscape, the gate closes, the match can start, and touch controls appear. This is a browser emulation check, not physical Android testing.
- `node --check game.js`, `git diff --check`, all 12 MP3 decode checks, and local HTTP 200 checks for the new pose, special-effect, stage and announcer assets passed.

## Public deployment verification

The game update was pushed to GitHub `main` in commit `f6db0bdff7277b5c979fd758bb05c04f1c2a85da`. The exact production URL `https://rally-rumble-i8od.vercel.app/` returned HTTP 200 with title `Rally Rumble — Select Your Neta`. Its deployed `game.js` SHA-256 was exactly identical to this repository's file (`ca4f7c823f4fa69f7fb3e792dfa100334712fb6420272b781fc0b4dad59845bf`). New pose/effect/stage assets and all 12 announcer URLs returned HTTP 200; the browser's audio streaming responses were successful partial-content responses. A fresh production-browser session reached the fight HUD with no page errors or failed requests.

No Vercel domains were changed or repointed. Physical Android/fullscreen behavior and performance on real devices remain unverified.


## 2026-11-10 — spelling and Rail Raja artwork fix

- Corrected `TARIFF TAIL` to `TARIFF TAAU` in the fighter data and select card; confirmed the `DEEDEE` label is spelled correctly.
- Replaced Rail Raja's reused Tariff Taau card/sprite/preview image with an original, hand-authored fictional conductor illustration at `public/assets/fighters/rail-raja-original.svg`.
- Validation: `node --check game.js`, `git diff --check`, HTML/SVG and label assertions, and a 1280×720 headless Chromium render all passed. The first-run bilingual satire notice appeared as expected. The only Chromium stderr was a missing sandbox host UPower D-Bus service, unrelated to the game.
- This is a focused bug-fix slice; the additional scope in the new Sansad Showdown brief remains unfinished and is not claimed complete.


## 2026-11-10 — roster and combat-feel improvement pass

Added original full-body SVG designs for Ghar Mantri, Fact Bhai, and Toll Man; Rail Raja also retains his original artwork. That makes the Toll Man and Rail Raja select portraits/body art independent from previously reused roster art. The expanded roster now contains eleven selectable parody fighters, a disabled boss slot, and Random, arranged in two rows. Random selection no longer includes hidden or non-roster character definitions. Every fighter has a distinct speed, power, vitality, and jump profile; Ghar Mantri and Fact Bhai have their own named supers and themed visual effects.

The combat simulation now advances on a capped 60 Hz fixed timestep, adds short hit-stop on clean hits, uses fighter power for attack damage and fighter speed/jump/vitality in movement and HUD, and shows a delayed red vitality trail. CPU reaction targets are aligned to the specified 25/14/6-frame difficulty values. Canvas requests desynchronized rendering when supported.

Validation passed: JavaScript syntax and diff checks; assertions for the 11 roster entries, four original SVG character assets, special moves, stats, fixed-step loop, hit-stop, locked boss slot, and removal of hidden non-parody roster entries; desktop Chromium loaded all 11 distinct roster portraits, selected Ghar Mantri vs Fact Bhai, advanced the fight timer, and verified an attack reduced vitality from 100% to 85.2%; and 844×390 touch-landscape layout checks confirmed no rotation gate and visible touch controls. No page errors or failed network requests were observed. These are emulator/browser checks, not physical Android or sustained-device FPS measurements.


## 2026-11-11 — full-body 3D fighter and movement pass

- Replaced the live WebGL character cutout route with a locally hosted Three.js 0.180 mesh renderer (`fight-rig3d.js`). It builds full heads/faces, torsos, hands, paired upper/lower arms and legs, boots, shoulder/elbow and hip/knee pivots, and roster-specific costume/prop details for all 11 fighters. The MIT license is included beside the vendor modules. No extra static character image was needed; the body, joints and distinguishing props are modeled in the rig.
- Synchronized the rig with combat positions, facing, velocity, attacks/timers, block, crouch, hit, fall and round-end state. Added subtle idle limb/foot movement, clearer crouch arm poses and non-accumulating victory torso tilt after the independent audit found those polish gaps. The WebGL fallback continues to draw a live articulated Canvas body, now with idle foot/arm motion and explicit winner/fall limb poses.
- Added distinct 3D identity cues, including DeeDee's bun/earrings, Mbapu's moving staff, Ghar Mantri's hand-held folio, Fact Bhai's moving magnifier, Rail Raja's ticket tool, and Toll Man's baton, while preserving roster palettes and face/hair cues.
- Independent per-fighter source audits covered all 11 IDs and confirmed complete WebGL mesh bodies, two articulated arms and legs per fighter, shared state-based pose wiring and the articulated fallback. The audit's shared idle/crouch/winner-fall findings were corrected; the 11-rig browser regression then passed with 40+ meshes per character and no page errors or failed requests.
- Desktop Chromium verified live keyboard-driven walk, punch, kick, jump and crouch joint changes. A separate forced-WebGL-failure browser run entered combat with the articulated Canvas fallback and no page exceptions. Phone-landscape WebGL startup, touch layout, rotate gate and <=1.2 device-pixel-ratio cap passed in browser emulation.
- `node --check game.js`, ES-module syntax check, `git diff --check`, and the vendored Three.js MIT license assertion passed. These are local Chromium/emulator checks only; physical Android and sustained real-device FPS testing have not been performed. The rigs are stylized original procedural mesh models, not imported skinned GLBs or motion capture.
