# Reference breakdown: Rally Rumble recreation

## स्रोत और निरीक्षण की सीमा

- User video: `IMG_20261106_160510_369.mp4`, 1600×720, लगभग 168.3 सेकंड। 8-सेकंड अंतराल पर sampled frames और पूरे वीडियो के दृश्य/audio summary से यह breakdown तैयार है। समय अनुमानित है; कुछ क्षण sampled frames के बीच बदलते हैं।
- Website: [fightkaro.com](https://fightkaro.com/), शीर्षक “Sansad Showdown — Political Satire Fighter”। वर्तमान entry page में `Loading neta assets…`, sound toggle, canvas और Hindi/English satire notice है। आगे बढ़ने के लिए “I UNDERSTAND · CONTINUE” legal acknowledgement दिखता है; इसे user की ओर से स्वीकार नहीं किया गया, इसलिए page के अंदर की interactions इस निरीक्षण में स्वतंत्र रूप से सत्यापित नहीं हैं।
- मौजूदा GitHub code: vanilla HTML/CSS/Canvas, keyboard + touch controls, CPU fighter, rounds, Sutli Bomb, दो existing arena images, portraits और दो attributed music tracks। यह 2D implementation है, जबकि video art में depth/3D-जैसा shading दिखता है।

## Timeline और दृश्य

### 0:00–0:02 — Character selection

शीर्ष पर “SELECT YOUR NETA” headline और VS layout है। शुरुआती matchup में “Tariff Taau” और “Yatra Boy” portraits दिखते हैं; नीचे अनेक character cards हैं। Selection panel में fighter portrait/name, “Play with a Friend”, “Fight!” और difficulty/stage जैसे विकल्प दिखते हैं। Video बाद में Mbapu को player और Mitraman को CPU के रूप में चुनता है।

### 0:02–0:06 — Loading / match intro

Character selection से fight में transition होता है। “Downloading Mbapu…” progress text आता है। Mitraman taunt pose में दिखाई देता है। समय/loader को छोटा रखा जा सकता है, लेकिन selection के बाद loading cue और player/opponent पहचान स्पष्ट होनी चाहिए।

### 0:07–0:58 — Round 1

Sansar stage पर 60 से countdown timer, top-left/top-right health/Shakti bars, player labels और bottom-corner touch controls दिखाई देते हैं। Mbapu (player) और Mitraman (CPU) punch, kick, jump/air hit और block/counter जैसे action करते हैं। CPU “Mitra Chakra” special करता है: fighter ऊपर उठता है और gold disc/halo effect opponent पर उतरता है। Hit sparks, motion rings, callout text और occasional “SUTLI BOMB” floor hazard दिखते हैं। Round end पर oversized red “GHEE KHATAM!”-style banner आता है; इस round में Mbapu आगे/विजेता है।

### 0:59–1:47 — Round 2

“ROUND 2” overlay से नया round आरंभ होता है; health/position reset और round score आगे बढ़ता है। दोनों fighters फिर close-range moves, dodges और special effect का आदान-प्रदान करते हैं। Mitraman फिर “Mitra Chakra” उपयोग करता है और इस round में Mbapu को हराता है।

### 1:48–2:36 — निर्णायक round

“FINAL ROUND”/“Final round fight” announcer cue आता है। 60-second round में battle जारी रहता है। Mbapu का “Manch Chhodo” special grab, spin, glowing gold ring और ground slam sequence के रूप में दिखता है। White/gold particles और impact emphasis के बाद Mitraman गिरता है। Round result “GHEE KHATAM!” और “YOU WIN!”/Mbapu win cue के साथ आता है।

### 2:37–2:48 — Victory / newspaper

“Sansad Times” newspaper-style result card खुलता है। Main headline “MBAPU WINS WITH SABAR & SHANTI!” है; score 2–1 और satirical headlines/subheadlines जैसे “Nail-biter 2-1 — Recount demanded” तथा “Breaking: Sansad mein sirf green patakhe allowed.” दिखते हैं। Post-game choices में Rematch, Character Select, Diwali card, feedback (“Maza aaya?”) और chai (“Ek chai pilaao”) शामिल हैं।

## Fighters और move identity

| Video label | Visual identity / role | Signature behavior |
| --- | --- | --- |
| Mbapu | बहुत पतले वृद्ध parody fighter, गोल चश्मा, सफेद dhoti, लाठी-संबंधित silhouette | तेज घूमता movement; “Manch Chhodo” grab-spin-slam; “Sabar & Shanti” victory headline |
| Mitraman | सफेद बाल/दाढ़ी, saffron/orange kurta-dhoti | शांत stance; “Mitra Chakra” हवा में उठकर gold disc strike |
| Tariff Taau | शुरुआती select screen का exaggerated political parody fighter | उपलब्ध वीडियो में मुख्य fight moves स्पष्ट नहीं; default special को generic arcade move से दिखाना |
| Yatra Boy | शुरुआती select screen का exaggerated political parody fighter | उपलब्ध वीडियो में मुख्य fight moves स्पष्ट नहीं; default special को generic arcade move से दिखाना |
| Deedee, Toka Man, Sutti Babu | roster grid में छोटा portrait/icon | video में combat set स्पष्ट नहीं; playable base moves से शुरू करें |

Video analysis में “Lamba Bhashan Combo” और “Vikas Uppercut” नाम callouts मिले। इन्हें roster-wide combo/move text के रूप में छोटे popup के तौर पर इस्तेमाल किया जा सकता है। सभी portrayals स्पष्ट cartoon/satire हैं; fictional disclaimer और non-affiliation statement visible रहेंगे।

## Stage, HUD और input

Sansar रात का courtyard/assembly-like outdoor space है। Center floor पर large multicolor mandala/rangoli; पीछे parliament-shaped building, Diwali lamps, string lights और candles; दोनों ओर 2D crowd silhouettes placards (“VOTE!”, “JAI HIND!”, “BADLAV”) उठाए हैं। Camera side-on 2.5D fighting plane पर स्थिर है।

HUD में दोनों fighters के health/Shakti bars और name tags ऊपर हैं; केंद्र में 60-second timer, round label और special-ready cues हैं। Touch HUD के lower-left में virtual joystick है; lower-right में GRAB, SUPER, PUNCH और KICK buttons। Round announcements central overlay में बड़े display text के साथ आते हैं।

Keyboard support मौजूदा repo में है: A/D या arrows move, W/up jump, S/down crouch, away input block; J punch, K kick, I grab, L/Space super, Esc pause, M sound, N music। Mobile में same actions virtual joystick/buttons से मिलने चाहिए।

## Audio notes

Speech-to-text से कुछ cues स्पष्ट/आंशिक मिले: “Round one fight.” लगभग 00:10.5; Hindi line “जिस राह पे तुम चल रहे हो बेटा, एक दिन बुरी तरह फंसोगे… उस दिन मुझे याद करना, मैं पहुंच जाऊंगा।” लगभग 00:40.9, 01:24.9 और 02:09.1 के हिस्सों में; “Round two fight.” 00:59; “Final round fight.” 01:48.3; “You win.” 02:26.5। बीच का Sanskrit-जैसा chant transcription अस्पष्ट है, इसलिए उसे वास्तविक श्लोक/सटीक quote मानकर पुनः इस्तेमाल न किया जाए।

काम में fictional announcer lines और browser speech/synthesized sound उपयोग करें; किसी real person की voice clone न करें। Existing game में मौजूद CC BY-credited Bhangra और comedic ragtime tracks retain हों। User-provided video audio को अलग meme clip के रूप में extract करके distribution में डालने की अनुमति/rights स्पष्ट नहीं हैं, इसलिए उसे asset के रूप में pack न करें।

## UI copy reference

- `SELECT YOUR NETA`
- `PLAY WITH A FRIEND`, `FIGHT!`, difficulty levels, stage selector
- `MBAPU (YOU)`, `MITRAMAN (CPU)`, health/Shakti indicators, timer 60
- `ROUND 1`, `ROUND 2`, `FINAL ROUND`
- `Mitra Chakra`, `Manch Chhodo`, `Lamba Bhashan Combo`, `Vikas Uppercut`
- `SUTLI BOMB — Ring se bahar bhaago!`
- `GHEE KHATAM!`, `YOU WIN!`
- `SANSAD TIMES`, `MBAPU WINS WITH SABAR & SHANTI!`
- `REMATCH`, `CHARACTER SELECT`, `DIWALI CARD BHEJO`, `MAZA AAYA?`, `EK CHAI PILAAO`

## Fidelity decisions

इस चरण में Canvas architecture बरकरार रखकर layered 2D sprites, stage art, light/particle effects और camera-depth cues से reference का look/flow बनाया जाएगा। यह video जैसा playable adaptation होगा; एक-एक video pixel की clone नहीं, और 3D engine conversion इस scope में नहीं है। Website के legal notice की acceptance, production domain mapping या Vercel deployment बदलना code recreation से अलग कार्रवाई है।
