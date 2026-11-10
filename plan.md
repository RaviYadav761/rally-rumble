# Rally Rumble — video-based close remake plan

## सही reference और scope

यह काम `/home/ubuntu/upload/VID_20261107_224523_118.mp4` पर आधारित है (1280×720, लगभग 78:57)। शुरुआती OBS/YouTube capture खेल का हिस्सा नहीं है; वास्तविक game flow लगभग 56 सेकंड से शुरू होने वाले `SELECT YOUR NETA` screen और उसके बाद के Sansad matches में दिखता है। विस्तृत निरीक्षण लगभग 56–181 सेकंड के segment पर आधारित है।

उपयोगकर्ता ने साफ़ किया है कि original playable source उपलब्ध नहीं है और video से जितना close हो सके remake चाहिए। इसलिए लक्ष्य **high-fidelity approximation** है, pixel-perfect/bit-for-bit clone नहीं। Reference में 3D-जैसे full-body models हैं; इस offline HTML/Canvas project में paid 3D model generation नहीं मानेंगे। मौजूदा Canvas/combat engine को बनाए रखते हुए reference frame से inspired 2.5D stage, cutout/portrait character presentation, better posing and special-move props बनाए जाएँगे। जहाँ exact rig/model/voice source मौजूद नहीं है, वहाँ approximation साफ़ बताई जाएगी।

## Reference में दिखाई देने वाले मुख्य facts

- Character select heading `SELECT YOUR NETA`; roster: `MITRAMAN`, `YATRA BOY`, `DEDEE`, `TARIFF TAIL`, `DOZER DADA`, `TOLL MAN`, `SUTTI BABU`, `RAIL RAJA`, `MBAPU`, `RANDOM`.
- Select fields: 1P और CPU picks, `SANSAD`, `JANTAR MANTAR`, `DESI SADAK`; difficulty `EASY / NORMAL / HARD`; friend/local-play option और fight/loading action. Sample match: Dozer Dada (1P) vs Yatra Boy (CPU), उसके बाद Dozer Dada vs Toll Man.
- Sansad arena: रात का, चौड़ा side-view; curved/cylindrical Parliament-like colonnade, side crowd bays/signs, झंडे और colored hanging lights; foreground में checkerboard floor और बड़ा multicolor rangoli.
- Battle HUD: screen-edge के पास लंबी angled health bars और fighter names, बीच में बड़ा timer (60 से start) तथा नीचे compact pause button; corner portraits/round indicators; नीचे `SHAKTI READY` cue.
- Bottom overlays: red scrolling satirical headline strip और उसके ऊपर छोटा `LIVE / BREAKING BAKWAS` vs `TROLL ARMY` commentary panel.
- Round flow: `ROUND 1` → 60-second fight → `ROUND 2`; best-of-three और final result. हारने वाले पर बड़ा `YOU LOSE`, winner victory pose.
- विशिष्ट moves: Dozer Dada का `DOZER KA DHAMAKA`/bulldozer sequence; Yatra Boy का `ALOO → SONA` machine sequence और gold-bar shower. Speech pass में `Round one fight`, `Round two fight`, `You lose`, तथा aloo/sona machine dialogue सुनाई देता है; Hindi ASR अपूर्ण है।

## Implementation priorities

1. **Live Vercel पहले:** `vercel.json` में root output ठीक किया गया है; अब updates के बाद उसी `rally-rumble-i8od.vercel.app` पर नया deploy और वास्तविक route/assets verify करना है।
2. **Game shell और selection:** active game 16:9 viewport भरता है, outer branded webpage chrome नहीं; legal satire notice और mobile portrait rotate gate सुरक्षित। Notice के बाद सीधे reference-style selection screen खुले। Horizontal roster, बड़े VS previews, सही labels/default pair, stage और difficulty controls.
3. **Stage/camera:** supplied segment से प्रेरित close curved Sansad colonnade, side crowd/signs, strings/flags और floor rangoli. Image is a 2.5D backdrop; Canvas depth cues, floor shadows and parallax remain lightweight.
4. **Battle presentation:** top edge angled bars, timer, portraits/round markers, central intro/round callouts, bottom ticker + live commentary panel and Shakti-ready cue. Camera/character scale should match the sample's medium-full-body framing.
5. **Characters and animation:** Dozer, Yatra, Toll Man prioritized. Use sample frames as visual anchors; the Dozer/Yatra transparent full-body and separate idle/strike pose images are generated approximations, not extracted game sprites. Switch the available Dozer punch and Yatra kick poses during their active frames, and keep the authored Canvas joint rig for the wider roster. Make punch/kick wind-up, guard, recovery, recoil, knockback, knockdown and victory states readable; avoid implying a paid 3D rig where none exists.
6. **Sample-specific specials:** bulldozer entry/impact for Dozer; aloo-to-sona machine + gold bars for Yatra. Use short callout typography, hit sparks and separate original generic Hindi/Hinglish voice cues. Do not clone an identifiable real voice or bundle sample audio as a game asset.
7. **Mobile/desktop and performance:** only start play on phone in landscape; pause on returning to portrait; pointer/touch safe areas and optional fullscreen; keyboard remains fully playable on desktop; keep Canvas animation delta capped and avoid unnecessary heavy dependencies.
8. **QA/publication:** `node --check`, `git diff --check`, local Chromium desktop/portrait/landscape, selection/fight/special/result transitions, requested asset HTTP status, then push to the authorized GitHub main and verify the exact Vercel URL. Report only checks actually run; physical Android checks are separate.

## Design direction

**Visual movement:** 3D-game-inspired 2.5D political-parody fighter; warm amber lights against a purple/navy night, vivid rangoli floor, punchy gold/cream HUD typography. This is materially closer to the supplied scene than the prior flat poster/menu treatment, but full 3D models require unavailable source assets and are not claimed.

**Selection paradigm:** top centered italic heading/instructions; player and CPU previews facing one another with `VS`; 10 compact horizontal character cards across the lower portion; stage/difficulty/actions below them. Current selection badges explicitly say 1P/CPU.

**Fight paradigm:** full viewport stage; grounded full-body fighters occupying the center; long top bars and central timer; bottom edge carries ticker/commentary. No newspaper-style result card in the battle flow.

**Audio policy:** original generic announcer voice for Hindi/Hinglish lines; timing and concepts follow the reference. A real-person or recognizable actor voice will not be cloned, and user-video audio is reference-only unless separately licensed original source files are supplied.

## Architecture and files

- `index.html`: legal notice, selection screen, edge HUD, ticker/commentary, round/result overlay, touch controls, pause and orientation gate.
- `styles.css`: viewport-first 16:9 stage and reference-style HUD/selection composition; responsive landscape play.
- `game.js`: existing Canvas combat/AI/round loop plus Dozer/Yatra special sequences and UI updates.
- `public/assets/stages/`: reference-inspired Sansad stage and existing backup stages.
- `public/assets/fighters/`: existing original roster art and any extracted/edited user-video cutouts; credits must distinguish source vs generated assets.
- `public/assets/audio/announcer/`: original generic Hindi clips, not the source video's voice.
- `docs/REFERENCE_SPEC.md`: verified observations from the actual attachment and limits.
- `README.md`, `TODO.md`, `plan.md`: updated usage, acceptance and progress.

## Hosting

Repository: `RaviYadav761/rally-rumble`, branch `main`. User's production URL: `https://rally-rumble-i8od.vercel.app/`. The Vercel root-output configuration is already repaired and the public URL was smoke-tested; each subsequent push still requires fresh deployment verification. Do not repoint `fightkaro.com` or another production domain.
