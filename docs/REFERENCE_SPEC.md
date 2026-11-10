# Reference specification — actual user-supplied gameplay video

## Source and method

- **Actual attachment:** `VID_20261107_224523_118.mp4` (1280×720, about 4,737 seconds / 78:57).
- **Segment reviewed:** approximately 56–181 seconds, including the character-select screen, Dozer Dada vs Yatra Boy rounds, a result, and the next opponent selection/start.
- **Important correction:** earlier project notes used a different 168-second file and incorrectly treated the game as a flat 2D fighter. Those notes were stale and must not be used as the visual source of truth.
- Opening recording/OBS/YouTube context is not part of the game. Browser chrome appears around the game in the video but is also not a game element.
- This document summarizes selected frames and one machine-transcribed audio excerpt; it is not a forensic frame-by-frame transcript of the entire recording.

## Verified in-game look

The sample is a browser fighting game presented in a **3D-looking side-view**. Full-body characters have shaded faces, loose Indian outfits, visible hands/feet and character-specific proportions. They idle in guard poses, punch/kick/grapple, recoil, fly/knock down and celebrate. The camera frames the action at medium full-body scale and can reframe around action/special sequences.

The Sansad night arena has a large curved/cylindrical Parliament-like colonnade across the background, crowd areas at the sides with placards, flags and hanging colored festival lights. The floor uses a checkerboard perspective border and a large multicolor rangoli. The scene is an integrated 3D-looking environment, unlike the previous repository's frontal flat background.

## Selection screen

The heading reads **`SELECT YOUR NETA`**. A large `VS` and full-body CPU preview occupy the center/right; the roster is a horizontal row of 10 cards in the lower third. The observed card labels are:

`MITRAMAN`, `YATRA BOY`, `DEDEE`, `TARIFF TAIL`, `DOZER DADA`, `TOLL MAN`, `SUTTI BABU`, `RAIL RAJA`, `MBAPU`, `RANDOM`.

Visible options include `SANSAD`, `JANTAR MANTAR`, `DESI SADAK`; CPU difficulty `EASY`, `NORMAL`, `HARD`; and `PLAY WITH A FRIEND`. The selection instructions mention picking 1P then CPU and keyboard controls; a progress/loading state can show `DOWNLOADING DOZER DADA…`, then `FIGHT!`. In the reviewed match, 1P is Dozer Dada, CPU is Yatra Boy, stage Sansad and Normal is selected. A later selection changes CPU to Toll Man.

## Battle HUD and overlays

- Long, angular, brightly filled health bars hug the top edge, with fighter names at far left/right; corner portraits and round markers sit near the CPU side.
- A large timer is centered at the top and starts at 60; a small pause button is immediately below it.
- A `SHAKTI READY` indicator appears near the lower-right edge; energy bars run along the lower edges.
- A red scrolling headline ticker runs along the bottom. Above it, a compact framed panel reads `LIVE`, `BREAKING BAKWAS` and `TROLL ARMY` and shows rotating satirical commentary/chat lines.
- Round intro uses large in-scene typography (e.g. `ROUND 1`). A loss keeps the arena and downed/winning fighters visible beneath a large `YOU LOSE`; this differs from the prior newspaper-first result treatment.

## Verified moves and audio cues

- A two-hit `LAMBI YATRA KICK` lands with an impact flash; `COUNTER!` appears during combat.
- Dozer's signature is announced as `DOZER KA DHAMAKA!` / bulldozer cue; a yellow bulldozer/backhoe crosses the arena and hits the opponent.
- Yatra's `ALOO → SONA` move shows a green machine and gold-bar shower. A small warning/callout appears during that sequence; the reviewed slice also includes a spoken line explaining potatoes entering one side and gold coming out the other.
- The sample includes `ROUND 1`, `ROUND 2`, `ROUND 1 FIGHT` and `YOU LOSE` speech cues. ASR also picked up the Hindi/Hinglish machine line approximately: “aisi machine… is side se aloo ghusega, us side se sona niklega”; transcription is incomplete/noisy and does not establish every word or voice identity.
- At match result, an in-scene win pose overlays large `YOU LOSE`; a later out-of-fight results card includes `SANSAD TIMES`, `YATRA BOY WALKS TO VICTORY!`, score and `REMATCH` / `CHARACTER SELECT` / `DIWALI CARD BHEJO` actions. The battle-scene loss treatment is the priority for the fight overlay.

## Approximate timeline within the reviewed segment

- Source ~56s: `SELECT YOUR NETA`, roster, VS preview and controls.
- Source ~66s: Sansad match begins with intro dialogue and 60-second HUD.
- Source ~76–91s: kicks/grapples/counters.
- Source ~95s: Dozer bulldozer special.
- Source ~105s: Aloo-to-Sona machine special.
- Source ~111s: Round 1 win treatment.
- Source ~115s: Round 2 begins; match proceeds with another special.
- Source ~145s: large `YOU LOSE` treatment.
- Source ~154s: Sansad Times result card; rematch/select actions.
- Source ~163s: selection screen returns with Toll Man CPU.
- Source ~170s: another `ROUND 1` begins.

Timestamps are approximate because the original clip includes recording context and the transcribed segment is not a frame-accurate event log.

## Rebuild limits and decisions

The local repo contains static WebP character art and a Canvas combat loop, but no source GLB/FBX models, skeletal rig/animation files or original game scripts from the video. The code ZIP provided earlier contains a FightKaro guide page, not the playable game. The remake therefore prioritizes recognizable screen composition, stage, roster labels, HUD/ticker, Dozer/Yatra move concepts, mobile landscape flow and playable combat using 2.5D assets. It must not claim pixel-perfect 3D reproduction.

The reference video is used for visual/line/timing guidance. Its mixed soundtrack and any identifiable voice are not copied into the build; game dialogue uses original generic Hindi/Hinglish speech, with no real-person voice cloning.