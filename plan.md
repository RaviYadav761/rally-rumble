# Rally Rumble — reference-driven rebuild plan

## उद्देश्य और दायरा

`RaviYadav761/rally-rumble` के मौजूदा browser-native Canvas गेम को दिए गए 2:48 के gameplay video और `https://fightkaro.com/` के दृश्य संदर्भ के अनुरूप नया रूप देना। उपयोगकर्ता ने character art को 2D animation में बदलने का उल्लेख किया है, इसलिए मौजूदा HTML/CSS/Canvas आधार को बनाए रखते हुए 2D sprite और layered stage से reference का 2.5D प्रभाव बनाया जाएगा; Three.js/Godot migration या नया backend इस चरण में शामिल नहीं है। लक्ष्य video के gameplay flow, UI, characters, arena, special attacks, round results और mobile controls का उच्च-साम्य वाला playable recreation है, न कि video को वेबसाइट पर चलाना।

`fightkaro.com` पर अभी `Sansad Showdown — Political Satire Fighter` शीर्षक का WebGL/Canvas पेज, “Loading neta assets…” state, audio control और Hindi/English satire notice दिखता है। कानूनी notice को स्वीकार किए बिना gameplay स्क्रीन तक navigation नहीं की गई। इसलिए gameplay के विस्तृत व्यवहार का प्राथमिक reference उपयोगकर्ता का वीडियो है; वेबसाइट का URL शीर्षक/brand context और legal notice के लिए है।

## आवश्यक gameplay और सामग्री

- शुरुआत में “SELECT YOUR NETA” स्क्रीन, fighter portrait/cards, VS प्रस्तुति और CPU rival चयन हो। मुख्य video roster में Tariff Taau, Yatra Boy, Mbapu, Mitraman, Deedee, Toka Man और Sutti Babu शामिल हों; मौजूदा Shanti Sage और Kesar Kaka भी roster में बने रहें। नाम parody-style हों और स्पष्ट fictional satire notice रहे।
- Match में 60-सेकंड timer, best-of-three rounds, player/CPU health और Shakti meter, round pips, win/lose overlays तथा निर्णायक “GHEE KHATAM!”/“YOU WIN!” अवस्थाएँ हों।
- “Sansar” को मुख्य stage बनाना है: रात का courtyard, संसद-सदृश silhouette, रंगीन mandala/rangoli floor, दीवाली lamps/candles, string lights और sign पकड़े crowd silhouettes। मौजूदा Jan Sabha Maidan और Jantar Plaza stages सुरक्षित रहें।
- Punch, kick, grab, jump, block, hit/counter और CPU behavior चले। Mitraman का “Mitra Chakra” स्वर्ण चक्र और उछाल/impact effect के साथ हो; Mbapu का “Manch Chhodo” grab-spin-slam और light-ring/particle finish के साथ हो। “Lamba Bhashan Combo” और “Vikas Uppercut” जैसे short move callouts तथा “SUTLI BOMB — Ring se bahar bhaago!” hazard warning भी दिखें।
- Keyboard और touch UI में movement joystick तथा GRAB, SUPER, PUNCH, KICK actions उपलब्ध हों। चयन में EASY/NORMAL/HARD, stage चयन, “Play with a Friend” और “Fight!” entry शामिल हों। “Play with a Friend” इस offline static build में same-device local two-player mode होगा; online accounts/multiplayer service नहीं जोड़ी जाएगी।
- जीत स्क्रीन Sansad Times अख़बार रूप में हो, जिसमें “MBAPU WINS WITH SABAR & SHANTI!”, match score और Rematch/Character Select/Diwali card/feedback/chai जैसे विकल्प हों।
- Music और SFX user gesture के बाद चलें। मौजूदा attributed Bhangra और comedic tracks तथा synthesized hit effects को बनाए रखें। Video में सुनाई देने वाली lines से प्रेरित fictional text-to-speech callouts लिखे जा सकते हैं; किसी वास्तविक व्यक्ति की आवाज़ clone या बिना लाइसेंस का external meme audio import नहीं करना है।

## कार्यान्वयन का तरीका

मौजूदा `game.js` में fighter state/CPU/combat loop को आधार बनाकर roster data, round flow, attacks, stage hazards और Canvas render layers बढ़ेंगे। `index.html` में selection/options/HUD/results को reference के labels के अनुरूप रखा जाएगा। `styles.css` में 16:9 arena, compact HUD, neon/gold accents, scrolling roster और touch-safe controls होंगे। Character art को consistent transparent 2D game sprites के रूप में बनाया जाएगा; stage artwork अलग 16:9 layer रहेगा, जबकि HUD, foreground, lights, particles और hazards Canvas/CSS से render होंगे। Portraits को selection cards और HUD दोनों में reuse किया जाएगा। Existing music files/credits को सुरक्षित रखा जाएगा; नए generated assets को `public/assets/` में अलग folders में रखा और credits में दर्ज किया जाएगा।

## Design दिशा

**Design movement:** दीवाली-रात का satirical 2D arcade fighter, reference video के low-poly/volumetric appearance को hand-painted sprite art और layered lighting से संकेतित करे।

**Core principles:** पहचानने योग्य, स्पष्ट parody silhouettes; combat के लिए साफ foreground contrast; छोटे स्क्रीन पर readable HUD; हर special move का अलग visual/audio cue।

**Color philosophy:** गहरा indigo/navy रात का आधार है; saffron/gold festival lighting और Shakti को दर्शाता है; mandala में सीमित magenta, teal और vivid रंग combat plane से अलग रहते हैं।

**Layout paradigm:** 16:9 playfield के ऊपर किनारों पर fighter HUD, नीचे सुरक्षित touch controls; selection में left/right rivalry और scrollable roster; results में newspaper front-page।

**Signature elements:** Mandala floor ring; kandil/दीये और संसद silhouette; gold circular Shakti/special-move traces।

**Interaction philosophy:** हर action को छोटा, स्पष्ट feedback; selection पर तुरंत fighter/rival पहचान; mobile controls बड़े और screen safe-areas से दूर।

**Animation:** idle breathing/bob, run, jump, punch, kick, grab, hitstun, knockdown और victory pose के अलग sprite states; special moves में anticipation → active effect → impact → recovery timing; reduced-motion preference का सम्मान।

**Typography system:** bold condensed system face for HUD/announcer; newspaper result में serif masthead; Hindi/Hinglish labels को छोटे HUD आकार पर भी पढ़ने योग्य रखा जाए।

**Brand essence:** फोन और desktop पर जल्दी शुरू होने वाला दीवाली-रात political-parody brawler; स्वभाव: रंगीन, शरारती, arcade-जैसा।

**Brand voice:** छोटी, स्पष्ट, काल्पनिक Hinglish callouts। उदाहरण: “ROUND 1 — FIGHT!” और “SUTLI BOMB — RING SE BAHAR!”

**Wordmark / signature color:** repo का `RR` mark बना रहे; गेम स्क्रीन के अंदर Sansad Showdown/Sansad Times संदर्भ video के अनुरूप आए। Ownable Rally Rumble color `#f4ca68` रहेगा।

## Project structure

- `index.html`: title, satire notice, roster, CPU/friend mode, difficulty/stage options, HUD, touch controls, results और pause UI।
- `styles.css`: responsive shell, fighter-select cards, HUD, mobile safe-area और reduced-motion presentation।
- `game.js`: existing Canvas fighter/AI/input/audio loop, round state machine, attacks, hazards, stage and sprite rendering।
- `public/assets/portraits/`: वर्तमान licensed portrait assets।
- `public/assets/fighters/`: नई generated fighter sprite/pose sheets, roster icons और related transparent art।
- `public/assets/stages/`: Sansar का नया generated background; पुराने arena images root assets में फिलहाल सुरक्षित रहेंगे।
- `public/assets/audio/` और `public/assets/CREDITS.md`: मौजूदा licensed music, synthesized effects की जानकारी और नए asset credits।
- `docs/REFERENCE_SPEC.md`: video frame/timeline observations और live page audit।
- `README.md`, `TODO.md`, `plan.md`: उपयोग, acceptance clauses, प्रगति और architecture के दस्तावेज़।

## GitHub और hosting सीमा

काम छोटे, स्पष्ट milestones में `main` पर commit/push किया जाएगा ताकि प्रत्येक पूरा भाग GitHub पर उपलब्ध रहे। `fightkaro.com` पर मौजूद production game को बदलना अलग कार्रवाई है; Vercel परियोजना, domain mapping और सफल deployment evidence जाँचे बिना domain को overwrite या repoint नहीं किया जाएगा।
