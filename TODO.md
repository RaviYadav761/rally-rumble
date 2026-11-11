# Rally Rumble — video-based close remake TODO

## User-approved target

Recreate the supplied browser fighting game as closely as practical from its video, without claiming pixel-perfect identity or exact voice cloning. The original playable source is not available. Reference details are in [`docs/REFERENCE_SPEC.md`](docs/REFERENCE_SPEC.md). Keep mobile landscape gating, desktop keyboard play, working combat and lag-conscious rendering; the latest request requires full-body 3D fighter rigs.

## Acceptance checklist

- [x] **Start/selection flow:** keep the satire notice, then open `SELECT YOUR NETA` directly. On a touch phone in portrait, the rotate prompt blocks the game; after landscape, the prompt closes and does not repeat unless the phone rotates back.
- [x] **Reference roster and defaults:** show all 11 playable fighters (`MITRAMAN`, `YATRA BOY`, `DEEDEE`, `TARIFF TAAU`, `DOZER DADA`, `TOLL MAN`, `SUTTI BABU`, `RAIL RAJA`, `MBAPU`, `GHAR MANTRI`, `FACT BHAI`) plus Random and the locked Boss slot; default 1P Dozer Dada vs CPU Yatra Boy, Sansad stage, Normal difficulty. Keep card clicks and CPU selection functional.
- [x] **Selection screen composition:** large centered title/instructions, two facing full-body 3D previews with a central `VS`, two-row roster, stage/difficulty/friend options and one fight/loading action.
- [x] **Sansad arena:** use a close curved Parliament colonnade, side crowds/signs, flags and colorful hanging lights, checkerboard perspective floor and large multicolor rangoli, drawing from the real sample's frame. Other choices remain labeled Jantar Mantar and Desi Sadak.
- [x] **Battle HUD/scene:** edge-to-edge 16:9 viewport; long angled player/CPU health bars and names at the top; 60-second center timer, pause button, portrait/round indicators, Shakti meters/readiness, lower `LIVE / BREAKING BAKWAS` vs `TROLL ARMY` mini panel and scrolling red satire ticker.
- [x] **Full-body 3D combat/poses:** all 11 playable fighters use complete Three.js mesh bodies with head/face, torso, hands, feet, paired arms/shoulders/elbows and legs/hips/knees. The combat state drives idle guard/footwork, walk, punch, kick, grab/super, jump/land, crouch, hit/fall and round-end win poses. The WebGL route does not rotate a whole-body cutout. If WebGL is unavailable, independently articulated Canvas characters still fight.
- [x] **Sample specials:** Dozer's `DOZER KA DHAMAKA` includes a readable bulldozer entry/impact; Yatra's `ALOO → SONA` includes a machine and falling gold bars. Add clear action names and match the reference's pacing without copying the video soundtrack.
- [x] **Rounds/results:** announce Round 1/2, show timer resets and arena-integrated round/result text, with a large `YOU LOSE`/winner pose and working rematch/character-select actions.
- [x] **Audio:** original generic Hindi/Hinglish narrator clips for round starts and signature specials, plus light fight impacts/crowd feel. Reference video audio is not bundled and no identifiable real voice is cloned.
- [x] **Performance/responsiveness:** touch-safe controls, usable desktop keyboard, portrait gate/landscape resume, optional fullscreen, frame delta cap, capped WebGL pixel ratio and reused fighter pose state. No page errors in the local browser regression checks.
- [x] **Publish and verify:** 3D build commit `4c679f9` is pushed to GitHub `main`; `https://rally-rumble-i8od.vercel.app/` returned HTTP 200 for HTML, CSS, game/rig scripts and both local Three.js modules. Deployed files matched local bytes exactly; production Chromium loaded all 11 rigs and completed walk/punch checks with no page errors or failed requests. Physical Android validation has not been performed.

## Verified evidence

Earlier desktop Chromium checks completed selection → loading → fight → pause/resume → two rounds → result with no page errors or failed requests. Portrait touch emulation displayed the rotate gate; switching to landscape enabled play and touch controls. Dozer's bulldozer and Yatra's machine/potato/gold-bar specials were visually checked.

The 11-fighter source audit verified full WebGL bodies, paired shoulder/elbow and hip/knee pivots, and character-specific color/costume or prop cues for every roster ID. The audit found stationary idle limb poses, no special arm pose for crouch, and missing Canvas fallback win/fall staging; the shared pose solver and fallback were polished to address those gaps. After those fixes, Chromium checks passed for 11 loaded rigs (40+ meshes each, two arms and two legs), desktop and phone-landscape WebGL, no page errors/failed requests, and actual player-input changes during walk, punch, kick, jump and crouch. A forced-WebGL-failure run also reached the fight screen with articulated Canvas bodies and no page errors. These are browser/emulator checks, not a physical Android or sustained-FPS benchmark.

## Known fidelity boundary

Video-only recreation can match composition, copy, timing, stage cues and move concepts closely. The uploaded ZIP was a site guide page rather than the game source, so the current fighters are original stylized procedural mesh rigs with parent-child joint pivots—not imported artist-authored skinned GLBs, motion-capture animation or photorealistic likenesses. A jointed Canvas fallback is used when WebGL is unavailable. Pixel-perfect models and identical real voices are not claimed. If a complete original source/asset archive becomes available, replace approximations with those assets.

## Updated user request — full-body 3D fighter animation (2026-11-10)

The user's direction was: “हर एक कैरेक्टर को चेक करो प्रॉपर्ली है कि नहीं पैर लेग मूव हो रहे हैं कि नहीं 3D में दिख रहे हैं कि नहीं प्रॉपर्ली बस फेस दिख रहा है ऐसा नहीं होना चाहिए पूरा बॉडी ये सब दिखना चाहिए हाथ पैर ये हो प्रॉपर्ली मूव होना चाहिए हर एक चीज प्रॉपर्ली वर्क करना चाहिए। चेक करो जो भी सही नहीं है उसको सही करो जनरेट करो इमेज लगाओ वहाँ पर जो भी चाहिए तो।” The following outcomes were independently audited and verified:

- [x] **Full 3D body for every playable fighter:** complete 3D head, torso, both arms/hands and both legs/feet for all 11; no face-only WebGL fighters or static whole-sprite rotation.
- [x] **Body-driven game motions:** shared, synchronized articulation drives legs/feet during movement and shoulders/elbows/hips/knees through idle, attacks, guard, jump, crouch, hit/fall and win. Idle limb movement and crouch arm positioning were improved after the audit; Canvas fallback now has explicit win/fall body poses.
- [x] **Character-by-character audit and repair:** all 11 roster IDs were audited independently; original modeled face, costume, palette and prop cues were checked. Missing common idle/crouch articulation and the Canvas win/fall poses were corrected. Procedural mesh adjustments were more appropriate than adding another static 2D character image.
