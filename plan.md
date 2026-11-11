# Rally Rumble — video-based close remake plan

## सही reference और scope

यह काम `/home/ubuntu/upload/VID_20261107_224523_118.mp4` पर आधारित है (1280×720, लगभग 78:57)। शुरुआती OBS/YouTube capture खेल का हिस्सा नहीं है; वास्तविक game flow लगभग 56 सेकंड से शुरू होने वाले `SELECT YOUR NETA` screen और उसके बाद के Sansad matches में दिखता है। विस्तृत निरीक्षण लगभग 56–181 सेकंड के segment पर आधारित है।

Original playable source उपलब्ध नहीं है, इसलिए लक्ष्य **high-fidelity approximation** है, pixel-perfect/bit-for-bit clone नहीं। उपयोगकर्ता के नवीनतम निर्देश के अनुसार सभी 11 fighters side-view arena में actual Three.js/WebGL mesh-built 3D characters के रूप में render होते हैं। Parent-child joint pivots arms/legs को pose करते हैं, और existing combat/physics/AI state animation को drive करती है। Pixel-space arena coordinates orthographic camera से align होते हैं। WebGL combat में modeled head/face, torso, दोनों hands/arms, legs और feet दिखते हैं; portraits selection/fallback assets हैं, rotating full-body cutouts नहीं।

## Video reference में दिखाई देने वाले मुख्य facts

- Character select heading `SELECT YOUR NETA`; video roster: `MITRAMAN`, `YATRA BOY`, `DEDEE`, `TARIFF TAIL`, `DOZER DADA`, `TOLL MAN`, `SUTTI BABU`, `RAIL RAJA`, `MBAPU`, `RANDOM`.
- Select fields: 1P और CPU picks, `SANSAD`, `JANTAR MANTAR`, `DESI SADAK`; difficulty `EASY / NORMAL / HARD`; friend/local-play option और fight/loading action. Sample match: Dozer Dada (1P) vs Yatra Boy (CPU), उसके बाद Dozer Dada vs Toll Man.
- Sansad arena: रात का चौड़ा side-view; curved/cylindrical Parliament-like colonnade, side crowd bays/signs, झंडे और colored hanging lights; foreground checkerboard floor और multicolor rangoli.
- Battle HUD: screen-edge health bars/names, बड़ा center timer (60 से start), pause button, corner portraits/round indicators, नीचे `SHAKTI READY` cue.
- Bottom overlays: scrolling satire ticker और छोटा `LIVE / BREAKING BAKWAS` vs `TROLL ARMY` commentary panel.
- Round flow: `ROUND 1` → 60-second fight → `ROUND 2`; best-of-three/final result. हारने वाले पर `YOU LOSE`, winner victory pose.
- विशिष्ट moves: Dozer Dada का `DOZER KA DHAMAKA`/bulldozer sequence; Yatra Boy का `ALOO → SONA` machine और gold-bar shower. Speech pass में round/result तथा aloo/sona dialogue सुनाई देता है; Hindi ASR अपूर्ण है.

## Implementation priorities

1. **Live Vercel:** हर authorized push के बाद exact `rally-rumble-i8od.vercel.app` route और production assets verify करें; domains repoint न करें.
2. **Game shell and selection:** active game 16:9 viewport भरता है; satire notice और mobile portrait rotate gate सुरक्षित रहें; notice के बाद reference-style selection, roster, VS previews, defaults, stage और difficulty.
3. **Stage/camera:** close Sansad colonnade, side crowd/signs, flags, lights और rangoli को lightweight 2D backdrop के रूप में रखें.
4. **Battle presentation:** top health bars/timer/round HUD, central intro/callouts, bottom ticker/commentary and Shakti cue; grounded medium-full-body camera framing.
5. **Characters/animation:** shared articulated Three.js mesh renderer में all 11 fighters. Position, facing, velocity, grounded, attack/timer, block, crouch, hit-stun, knockdown और special state pose inputs हैं. हर fighter में full modeled head, torso, upper/lower arms, hands, upper/lower legs और feet; walk hips/knees/arms को alternate करे; punch, kick, guard, jump, landing, recoil, fall/victory अलग, state-driven poses हों. Signature palette, face, outfit और role prop उसी rig पर हों. WebGL fail होने पर individual parts वाले Canvas fallback चले—पूरी body image rotation नहीं. Dozer/Yatra machinery effects 2D layers बने रहें.
6. **Sample-specific specials:** Dozer bulldozer entry/impact; Yatra aloo-to-sona machine + gold bars. Original generic Hindi/Hinglish voice cues only; कोई identifiable real voice clone नहीं.
7. **Mobile/desktop/performance:** phones पर landscape gating, portrait return पर pause; keyboard/touch controls; local Three.js modules (runtime CDN dependency नहीं), सिर्फ दो active 3D rigs, capped pixel ratio, reused pose-state objects, capped Canvas delta और articulated fallback.
8. **QA/publication:** syntax/diff checks, Chromium desktop/phone-landscape, roster-wide joint audit, live movement/attack pose checks, no-WebGL fallback, फिर authorized GitHub `main` पर push और exact production URL/assets verify. Browser emulator checks को physical Android testing से अलग बताएं.

## Design direction

**Visual movement:** side-view ring में stylized full-body mesh-based 3D political-parody fighters; warm amber lighting, purple/navy night, vivid rangoli और gold/cream HUD typography. Face, clothing, limbs, footwear और signature props 3D geometry में हों; portraits selection/fallback assets हैं, WebGL bodies के विकल्प नहीं.

**Selection paradigm:** centered heading/instructions; player और CPU previews central `VS` के साथ; roster cards, stage/difficulty/actions नीचे; 1P/CPU badges.

**Fight paradigm:** full viewport stage, center में grounded full-body fighters, top health/timer, bottom ticker/commentary. Battle flow में newspaper-style result card नहीं.

**Audio policy:** Hindi/Hinglish के लिए original generic announcer cues; source-video audio reference-only है. Real-person voice clone नहीं.

## Architecture and files

- `index.html`: legal notice, selection, HUD, ticker/commentary, round/result overlay, touch controls, pause and orientation gate.
- `styles.css`: viewport-first stage, character canvas stacking, selection and responsive landscape play.
- `game.js`: Canvas arena/effects, combat/AI/round loop and Dozer/Yatra special sequences; per-fighter pose state `fight-rig3d.js` को देता है. WebGL अनुपलब्ध होने पर articulated Canvas characters draw होते हैं.
- `fight-rig3d.js`: transparent WebGL fighter overlay; shared hierarchical mesh-pivot rigs, fighter-specific materials/accessories, synchronized poses and reused frame state.
- `public/vendor/three.module.js` + `public/vendor/three.core.min.js`: locally hosted Three.js runtime modules; `public/vendor/THREE-LICENSE.txt` retains the MIT license.
- `public/assets/stages/`, `public/assets/fighters/`: stage backdrops and original roster/portrait art.
- `public/assets/audio/announcer/`: original generic Hindi clips, source-video audio नहीं.
- `docs/REFERENCE_SPEC.md`, `README.md`, `TODO.md`, `docs/PROGRESS.md`: observed reference, usage, acceptance and verified implementation notes.

## Hosting

Repository: `RaviYadav761/rally-rumble`, branch `main`. Production URL: `https://rally-rumble-i8od.vercel.app/`. Vercel root-output configuration is already repaired; fresh deployment verification is required after each subsequent push. Do not repoint `fightkaro.com` or another production domain.
