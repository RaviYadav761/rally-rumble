(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const GROUND = 430;
  const gravity = 1680;
  const keys = new Set();
  const justPressed = new Set();
  let audioContext = null;
  let soundOn = true;
  let musicIndex = 0;
  let lastFrame = performance.now();
  let screen = "title";
  let player = null;
  let cpu = null;
  let game = null;
  let matchSerial = 0;
  let touchAttack = null;
  let touchStickPointer = null;
  let touchStickOrigin = null;

  const fighterData = {
    tariff: { id: "tariff", name: "TARIFF TAAU", title: "THE DEALMAKER", color: "#f1e9d9", accent: "#f4c66c", dark: "#263247", skin: "#c58d72", hair: "#e7b956", style: "politician", special: "TARIFF TORNADO", sprite: "public/assets/fighters/tariff-taau.webp", portrait: "public/assets/fighters/tariff-taau.webp" },
    yatra: { id: "yatra", name: "YATRA BOY", title: "THE PEOPLE'S ROADRUNNER", color: "#eee9db", accent: "#5cb6a3", dark: "#26384b", skin: "#bd8069", hair: "#d1d0c8", style: "politician", special: "JAN YATRA JAB", sprite: "public/assets/fighters/yatra-boy.webp", portrait: "public/assets/fighters/yatra-boy.webp" },
    mbapu: { id: "mbapu", name: "MBAPU", title: "THE SAGE OF SABAR", color: "#f4eee1", accent: "#e8c96d", dark: "#756c62", skin: "#c99c81", hair: "#ece5d7", style: "sage", special: "MANCH CHHODO", sprite: "public/assets/fighters/mbapu.webp", portrait: "public/assets/fighters/mbapu.webp" },
    mitraman: { id: "mitraman", name: "MITRAMAN", title: "THE FESTIVAL STATESMAN", color: "#fff1d2", accent: "#ef9d45", dark: "#633d31", skin: "#bd8066", hair: "#eee7dc", style: "politician", special: "MITRA CHAKRA", sprite: "public/assets/fighters/mitraman.webp", portrait: "public/assets/fighters/mitraman.webp" },
    deedee: { id: "deedee", name: "DEEDEE", title: "THE BLUE-BORDER BOSS", color: "#f2eee2", accent: "#55a9ca", dark: "#344251", skin: "#bb826b", hair: "#28221e", style: "politician", special: "BENGAL BOUNCE", sprite: "public/assets/fighters/deedee.webp", portrait: "public/assets/fighters/deedee.webp" },
    toka: { id: "toka", name: "TOKA MAN", title: "THE PEOPLE'S AUDITOR", color: "#d7e7df", accent: "#6cbca2", dark: "#34444a", skin: "#bd8066", hair: "#262322", style: "politician", special: "MOHALLA METER", sprite: "public/assets/fighters/toka-man.webp", portrait: "public/assets/fighters/toka-man.webp" },
    suttibabu: { id: "suttibabu", name: "SUTTI BABU", title: "THE QUIET TACTICIAN", color: "#ece7d9", accent: "#b5b0a2", dark: "#4b4a49", skin: "#b9846a", hair: "#d9d5ca", style: "politician", special: "SUSHASAN SHUFFLE", sprite: "public/assets/fighters/sutti-babu.webp", portrait: "public/assets/fighters/sutti-babu.webp" },
    akhilesh: { id: "akhilesh", name: "AKHILESH YADAV", title: "THE CYCLE RALLY ACE", color: "#f1eadb", accent: "#ee6870", dark: "#293849", skin: "#b9775a", hair: "#26201e", style: "politician", special: "CYCLE RALLY", portrait: "public/assets/portraits/akhilesh-yadav.webp", faceCrop: [.10, .05, .80, .72] },
    shanti: { id: "shanti", name: "SHANTI SAGE", title: "THE PEACEFUL PUGILIST", color: "#f4e9d0", accent: "#e9ae40", dark: "#7b6548", skin: "#bd805f", hair: "#f4eadc", style: "sage", special: "SABAR & SHANTI" },
    kesar: { id: "kesar", name: "KESAR KAKA", title: "THE FESTIVAL FRONTMAN", color: "#f17834", accent: "#ffdc76", dark: "#963d2b", skin: "#a96048", hair: "#eee7d7", style: "performer", special: "CHAKRA UTSAV" }
  };

  const portraitImages = {};
  const fighterSprites = {};
  Object.values(fighterData).forEach((data) => {
    if (data.portrait) { const image = new Image(); image.decoding = "async"; image.src = data.portrait; portraitImages[data.id] = image; }
    if (data.sprite) { const image = new Image(); image.decoding = "async"; image.src = data.sprite; fighterSprites[data.id] = image; }
  });
  const arenaImages = { assembly: new Image(), market: new Image(), sansar: new Image() };
  arenaImages.assembly.src = "public/assets/arena-sansad.webp";
  arenaImages.market.src = "public/assets/arena-jantar.webp";
  arenaImages.sansar.src = "public/assets/stages/sansar-diwas.webp";
  const musicTracks = [
    { label: "MUSIC · RAGTIME", name: "Circus Theme (Ragtime Version)", src: "public/assets/audio/circus-theme-ragtime-version.mp3" },
    { label: "MUSIC · BHANGRA", name: "Bhangra Bass", src: "public/assets/audio/bhangra-bass.mp3" }
  ];

  const settings = { playerFighter: "tariff", cpuFighter: "yatra", stage: "sansar", difficulty: "normal", mode: "cpu" };
  const attackData = {
    punch: { duration: 0.30, activeStart: 0.13, activeEnd: 0.23, damage: 7, range: 108, knockback: 90, meter: 9, color: "#ffdc76" },
    kick: { duration: 0.43, activeStart: 0.18, activeEnd: 0.33, damage: 11, range: 128, knockback: 155, meter: 13, color: "#ef7592" },
    grab: { duration: 0.50, activeStart: 0.24, activeEnd: 0.37, damage: 15, range: 96, knockback: 230, meter: 17, color: "#f7f0d4" },
    super: { duration: 0.90, activeStart: 0.28, activeEnd: 0.66, damage: 29, range: 248, knockback: 350, meter: 0, color: "#f8c84a" }
  };

  const ui = {
    title: document.getElementById("titleScreen"), select: document.getElementById("selectScreen"),
    result: document.getElementById("resultScreen"), pause: document.getElementById("pauseOverlay"),
    legalGate: document.getElementById("legalGate"), acceptNotice: document.getElementById("acceptNotice"),
    hud: document.getElementById("hud"), touch: document.getElementById("touchControls"),
    sound: document.getElementById("soundToggle"), music: document.getElementById("musicTrackToggle"),
    musicPlayer: document.getElementById("musicPlayer"), playerPortrait: document.getElementById("playerPortrait"),
    cpuPortrait: document.getElementById("cpuPortrait"), cpuCycle: document.getElementById("cpuCycle"), playerHealth: document.getElementById("playerHealth"),
    playerEnergy: document.getElementById("playerEnergy"), cpuHealth: document.getElementById("cpuHealth"),
    cpuEnergy: document.getElementById("cpuEnergy"), playerName: document.getElementById("playerName"),
    cpuName: document.getElementById("cpuName"), cpuTag: document.getElementById("cpuTag"), timer: document.getElementById("timer"),
    round: document.getElementById("roundLabel"), combo: document.getElementById("comboText"),
    resultTitle: document.getElementById("resultTitle"), resultSub: document.getElementById("resultSub"),
    cpuPreviewName: document.getElementById("cpuPreviewName"), rivalLabel: document.getElementById("rivalLabel"),
    modeLabel: document.getElementById("modeLabel"), postActionMessage: document.getElementById("postActionMessage"),
    playerRounds: document.getElementById("playerRounds"),
    cpuRounds: document.getElementById("cpuRounds"), bombWarning: document.getElementById("bombWarning"),
    announcement: document.getElementById("fightAnnouncement"), stick: document.getElementById("virtualStick"),
    stickKnob: document.getElementById("stickKnob"), paperHeadline: document.getElementById("paperHeadline"),
    resultRounds: document.getElementById("resultRounds")
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath(); context.moveTo(x + r, y); context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r); context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r); context.closePath();
  }

  function setScreen(next) {
    screen = next;
    [ui.title, ui.select, ui.result].forEach((node) => node.classList.add("hidden"));
    ui.pause.classList.add("hidden");
    if (next !== "fight") ui.announcement.classList.add("hidden");
    ui.hud.classList.toggle("hidden", next !== "fight");
    ui.touch.classList.toggle("hidden", next !== "fight" || settings.mode === "friend");
    if (next === "title") ui.title.classList.remove("hidden");
    if (next === "select") ui.select.classList.remove("hidden");
    if (next === "result") ui.result.classList.remove("hidden");
  }

  function startSelect() {
    ensureAudio(); startMusic(); playTone(560, 0.07, "triangle"); updateSelectionUI(); setScreen("select");
  }

  function setHudPortrait(node, data) {
    if (!node) return;
    if (data.portrait) { node.src = data.portrait; node.hidden = false; }
    else { node.removeAttribute("src"); node.hidden = true; }
  }

  function announce(text, duration = 1.2, color = "#ffe17b") {
    if (!game) return;
    const callout = { text, time: duration, max: duration, color };
    game.callout = callout;
    ui.announcement.textContent = text;
    ui.announcement.style.setProperty("--callout-color", color);
    ui.announcement.classList.remove("hidden");
    window.setTimeout(() => { if (game && game.callout === callout) ui.announcement.classList.add("hidden"); }, duration * 1000 + 80);
  }

  function createGame() {
    const matchId = ++matchSerial;
    player = new Fighter(fighterData[settings.playerFighter], 258, 1, true);
    cpu = new Fighter(fighterData[settings.cpuFighter], 702, -1, settings.mode === "friend");
    game = {
      matchId,
      time: 60, intro: 2.1, paused: false, phase: "fight", effects: [], shake: 0,
      round: 1, playerRounds: 0, cpuRounds: 0, breakTimer: 0, nextRound: false,
      winner: null, message: "", bomb: null, bombClock: 10, callout: null, elapsed: 0,
      lastWinner: null
    };
    ui.playerName.textContent = fighterData[settings.playerFighter].name;
    ui.cpuName.textContent = fighterData[settings.cpuFighter].name;
    ui.cpuTag.textContent = settings.mode === "friend" ? "P2" : "CPU";
    ui.cpuCycle.textContent = settings.mode === "friend" ? "CHANGE PLAYER 2 ↻" : "CHANGE RIVAL ↻";
    setHudPortrait(ui.playerPortrait, fighterData[settings.playerFighter]);
    setHudPortrait(ui.cpuPortrait, fighterData[settings.cpuFighter]);
    ui.announcement.classList.add("hidden");
    updateHud(); setScreen("fight"); startMusic();
    speakAnnouncement("Round one. Get ready!", "en-US");
    playTone(260, 0.11, "triangle");
    window.setTimeout(() => { if (game && game.matchId === matchId && game.phase === "fight" && game.round === 1) speakAnnouncement("Fight!", "en-US"); }, 1050);
  }

  function startFight() { ensureAudio(); createGame(); }

  function beginRound() {
    game.phase = "fight"; game.time = 60; game.intro = 1.9; game.bomb = null;
    game.bombClock = 12 + Math.random() * 5; game.effects.length = 0; game.shake = 0;
    player.reset(258, 1); cpu.reset(702, -1); updateHud();
    speakAnnouncement(game.round >= 3 ? "Final round. Fight!" : `Round ${game.round}. Fight!`, "en-US");
    announce(game.round >= 3 ? "FINAL ROUND" : `ROUND ${game.round}`, 1.3);
  }

  function endRound(reason) {
    if (!game || game.phase !== "fight") return;
    game.phase = "round-end";
    const tiedOnHealth = reason === "time" && Math.abs(player.health - cpu.health) < 1;
    const playerWon = tiedOnHealth || player.health === cpu.health ? player.damageDealt >= cpu.damageDealt : player.health > cpu.health;
    if (playerWon) game.playerRounds += 1;
    else game.cpuRounds += 1;
    game.lastWinner = playerWon ? "PLAYER" : settings.mode === "friend" ? "P2" : "CPU";
    game.breakTimer = 1.55;
    game.round += 1;
    const roundText = tiedOnHealth ? (playerWon ? "ROUND TIE-BREAK · P1 WINS" : "ROUND TIE-BREAK · P2 WINS") : playerWon ? `ROUND TO ${fighterData[settings.playerFighter].name}!` : `${settings.mode === "friend" ? "PLAYER 2" : "CPU"} TAKES THE ROUND`;
    announce(roundText, 1.45, playerWon ? "#a6f4af" : "#ff9c94");
    speakAnnouncement(tiedOnHealth ? "Round tie-break!" : playerWon ? "Round jeet gaye!" : "Round unka!", "hi-IN");
    playTone(playerWon ? 520 : 150, 0.22, playerWon ? "triangle" : "sawtooth");
    updateHud();
    if (game.playerRounds >= 2 || game.cpuRounds >= 2) {
      const matchId = game.matchId;
      window.setTimeout(() => { if (game && game.matchId === matchId) finishMatch(game.playerRounds >= 2); }, 950);
    } else {
      game.nextRound = true;
    }
  }

  function finishMatch(playerWon) {
    if (!game) return;
    game.phase = "result";
    const playerName = fighterData[settings.playerFighter].name;
    const cpuName = fighterData[settings.cpuFighter].name;
    game.winner = playerWon ? "YOU WIN!" : "GHEE KHATAM!";
    game.message = playerWon ? `WELL FOUGHT, ${playerName}. WHAT A PERFECT COMBO.` : `${settings.mode === "friend" ? "PLAYER 2" : "THE NIGHT"} BELONGS TO ${cpuName}. RUN IT BACK?`;
    ui.resultTitle.textContent = game.winner;
    ui.resultSub.textContent = game.message;
    ui.paperHeadline.textContent = playerWon && settings.playerFighter === "mbapu" ? "MBAPU WINS WITH SABAR & SHANTI!" : `${playerWon ? playerName : cpuName} WINS WITH STYLE!`;
    ui.resultRounds.textContent = `${game.playerRounds} — ${game.cpuRounds}`;
    ui.postActionMessage.textContent = "";
    ui.result.classList.toggle("player-victory", playerWon);
    speakAnnouncement(playerWon ? "You win! Bahut badhiya!" : `Ghee khatam! ${settings.mode === "friend" ? "Player two" : "CPU"} jeet gaya!`, "hi-IN");
    playTone(playerWon ? 660 : 130, 0.28, playerWon ? "triangle" : "sawtooth");
    const matchId = game.matchId;
    window.setTimeout(() => { if (game && game.matchId === matchId && game.phase === "result") setScreen("result"); }, 680);
  }

  class Fighter {
    constructor(data, x, facing, isPlayer) {
      this.data = data; this.id = data.id; this.name = data.name; this.title = data.title;
      this.color = data.color; this.accent = data.accent; this.dark = data.dark;
      this.skin = data.skin; this.hair = data.hair; this.style = data.style; this.special = data.special;
      this.sprite = fighterSprites[data.id] || null; this.currentAttackSpec = null;
      this.portraitImage = data.portrait ? portraitImages[data.id] : null; this.faceCrop = data.faceCrop || null;
      this.x = x; this.y = GROUND; this.vx = 0; this.vy = 0; this.facing = facing;
      this.health = 100; this.energy = 20; this.damageDealt = 0; this.isPlayer = isPlayer; this.height = 160;
      this.attack = null; this.attackTimer = 0; this.attackHit = false; this.hitstun = 0;
      this.hurtFlash = 0; this.blocking = false; this.crouching = false; this.comboCount = 0;
      this.comboTimer = 0; this.aiClock = 0; this.aiBlock = 0; this.aiAttack = null;
      this.aiMove = 0; this.anim = Math.random() * 10; this.step = 0; this.specialSpin = 0; this.specialSpinAngle = 0;
    }
    get grounded() { return this.y >= GROUND - 1; }
    reset(x, facing) {
      this.x = x; this.y = GROUND; this.vx = 0; this.vy = 0; this.facing = facing; this.health = 100; this.energy = 20; this.damageDealt = 0;
      this.attack = null; this.attackTimer = 0; this.attackHit = false; this.hurtFlash = 0; this.currentAttackSpec = null;
      this.blocking = false; this.crouching = false; this.comboCount = 0; this.comboTimer = 0;
      this.aiClock = 0; this.aiBlock = 0; this.aiAttack = null; this.aiMove = 0; this.specialSpin = 0; this.specialSpinAngle = 0;
    }
    perform(type) {
      if (!type || this.attack || this.hitstun > 0 || !this.grounded || !attackData[type]) return false;
      if (type === "super" && this.energy < 100) { if (this.isPlayer) announce("SHAKTI NOT READY", 0.65, "#f1cb73"); return false; }
      this.attack = type;
      this.currentAttackSpec = type === "super" && this.id === "mbapu" ? { ...attackData.super, duration: 1.18, activeStart: .53, activeEnd: .79, damage: 36, range: 168, knockback: 280 }
        : type === "super" && this.id === "mitraman" ? { ...attackData.super, duration: 1.02, activeStart: .34, activeEnd: .68, damage: 28, range: 286, knockback: 330 }
          : attackData[type];
      this.attackTimer = this.currentAttackSpec.duration; this.attackHit = false; this.blocking = false;
      if (type === "super") {
        this.energy = 0; announce(this.special, 1.05, this.accent); speakAnnouncement(this.special.replace(/\s+/g, " "), "en-US");
        if (this.id === "mitraman") this.vy = -255;
      }
      playActionSound(type); return true;
    }
    takeHit(amount, attackType, attacker) {
      if (this.hitstun > 0 || this.health <= 0) return;
      const blocked = this.blocking && this.grounded && attackType !== "grab" && attackType !== "super";
      const actual = blocked ? amount * 0.18 : amount;
      this.health = clamp(this.health - actual, 0, 100);
      if (attacker && typeof attacker.damageDealt === "number") attacker.damageDealt += actual;
      this.energy = clamp(this.energy + (blocked ? 7 : amount * 0.92), 0, 100);
      this.hitstun = blocked ? 0.10 : attackType === "super" ? 0.48 : 0.24;
      this.hurtFlash = blocked ? 0.10 : 0.18;
      this.vx = attacker.facing * (blocked ? 42 : attackData[attackType].knockback);
      if (!blocked) {
        this.vy = attackType === "super" ? -220 : attackType === "kick" ? -95 : -65;
        game.shake = attackType === "super" ? 17 : 6;
        spawnImpact(this.x, this.y - 94, attackData[attackType].color, attackType === "super" ? 1.55 : 1);
        playImpactSound(attackType);
      } else { spawnImpact(this.x, this.y - 95, "#eaf0f3", 0.55); playTone(245, 0.045, "square"); }
      if (attacker.isPlayer) { attacker.comboCount = attacker.comboTimer > 0 ? attacker.comboCount + 1 : 1; attacker.comboTimer = 1.05; }
    }
    update(dt, input, enemy) {
      this.anim += dt * (this.grounded ? 7 : 2); this.hitstun = Math.max(0, this.hitstun - dt);
      this.hurtFlash = Math.max(0, this.hurtFlash - dt); this.aiBlock = Math.max(0, this.aiBlock - dt);
      this.comboTimer = Math.max(0, this.comboTimer - dt); if (this.comboTimer === 0) this.comboCount = 0;
      this.facing = enemy.x >= this.x ? 1 : -1;
      this.specialSpin = Math.max(0, this.specialSpin - dt);
      if (this.specialSpin > 0) this.specialSpinAngle += dt * 20;
      if (this.attack) {
        this.attackTimer -= dt; const spec = this.currentAttackSpec || attackData[this.attack]; const elapsed = spec.duration - this.attackTimer;
        if (!this.attackHit && elapsed >= spec.activeStart && elapsed <= spec.activeEnd) {
          this.attackHit = true;
          const distance = Math.abs(enemy.x - this.x);
          const vertical = Math.abs((enemy.y - enemy.height) - (this.y - this.height));
          if (distance <= spec.range && vertical < 116) {
            enemy.takeHit(spec.damage, this.attack, this); this.energy = clamp(this.energy + spec.meter, 0, 100);
            if (this.attack === "super" && this.id === "mbapu") {
              enemy.vy = -365; enemy.vx = this.facing * 390; enemy.specialSpin = .72;
              game.effects.push({ type: "slam-ring", x: enemy.x, y: GROUND - 8, life: .72, max: .72, color: "#f6d36d", spin: 0 });
            }
            if (this.isPlayer && this.comboCount >= 2) announce(`${this.comboCount} HIT COMBO!`, 0.8, "#fff1bb");
          }
          if (this.attack === "super") {
            if (this.id === "mitraman") {
              const fromX = this.x + this.facing * 55, fromY = this.y - 155;
              game.effects.push({ type: "chakra", fromX, fromY, x: fromX, y: fromY, targetX: enemy.x, targetY: enemy.y - 110, life: .55, max: .55, color: "#ffd54c", spin: 0 });
            }
            game.effects.push({ type: "wave", x: this.x + this.facing * 74, y: this.y - 108, life: 0.48, max: 0.48, color: this.accent, dir: this.facing });
            for (let i = 0; i < 9; i += 1) game.effects.push({ type: "paper", x: this.x + this.facing * (45 + Math.random() * 90), y: this.y - 100 - Math.random() * 80, life: 0.75 + Math.random() * 0.45, max: 1.2, color: i % 2 ? "#fff2d2" : this.accent, vx: this.facing * (60 + Math.random() * 100), vy: -110 - Math.random() * 100, spin: Math.random() * 6 });
          }
        }
        if (this.attackTimer <= 0) { this.attack = null; this.currentAttackSpec = null; }
      }
      if (this.hitstun <= 0 && !this.attack) {
        const dir = input.right ? 1 : input.left ? -1 : 0;
        this.crouching = !!input.down && this.grounded;
        this.blocking = !!input.block && this.grounded && !this.crouching;
        if (input.attack) this.perform(input.attack);
        if (input.jump && this.grounded && !this.crouching) { this.vy = -710; playTone(360, 0.055, "sine"); }
        if (!this.blocking && !this.crouching && !this.attack) this.vx = lerp(this.vx, dir * 285, Math.min(1, dt * 12));
        else if (this.blocking) this.vx = lerp(this.vx, 0, Math.min(1, dt * 16));
        else this.vx = lerp(this.vx, 0, Math.min(1, dt * 14));
      } else { this.blocking = false; this.crouching = false; this.vx = lerp(this.vx, 0, Math.min(1, dt * 4)); }
      if (Math.abs(this.vx) > 55 && this.grounded) this.step += dt * Math.abs(this.vx) / 18;
      this.vy += gravity * dt; this.x += this.vx * dt; this.y += this.vy * dt;
      if (this.y >= GROUND) { if (this.vy > 150) game.effects.push({ type: "dust", x: this.x, y: GROUND - 5, life: 0.34, max: 0.34, color: this.accent }); this.y = GROUND; this.vy = 0; }
      this.x = clamp(this.x, 55, W - 55);
    }
  }

  function getPlayerInput() {
    const useArrows = settings.mode !== "friend";
    const left = keys.has("a") || useArrows && keys.has("ArrowLeft"); const right = keys.has("d") || useArrows && keys.has("ArrowRight");
    const down = keys.has("s") || useArrows && keys.has("ArrowDown"); const jump = keys.has("w") || useArrows && keys.has("ArrowUp");
    const back = player && player.facing === 1 ? left : right;
    let attack = touchAttack; touchAttack = null;
    if (justPressed.has("j")) attack = "punch"; else if (justPressed.has("k")) attack = "kick";
    else if (justPressed.has("i")) attack = "grab"; else if (justPressed.has("l") || justPressed.has(" ")) attack = "super";
    return { left, right, down, jump, block: back, attack };
  }

  function getFriendInput() {
    const left = keys.has("ArrowLeft"), right = keys.has("ArrowRight"), down = keys.has("ArrowDown"), jump = keys.has("ArrowUp");
    const back = cpu && cpu.facing === 1 ? left : right;
    let attack = null;
    if (justPressed.has("1")) attack = "punch"; else if (justPressed.has("2")) attack = "kick";
    else if (justPressed.has("3")) attack = "grab"; else if (justPressed.has("4")) attack = "super";
    return { left, right, down, jump, block: back, attack };
  }

  function getCpuInput(dt) {
    const distance = Math.abs(player.x - cpu.x); cpu.aiClock -= dt;
    if (cpu.aiClock <= 0) {
      const difficulty = settings.difficulty;
      const reaction = difficulty === "easy" ? 0.50 : difficulty === "hard" ? 0.20 : 0.33;
      cpu.aiClock = reaction + Math.random() * 0.19; cpu.aiMove = distance > 142 ? Math.sign(player.x - cpu.x) : 0; cpu.aiAttack = null;
      const blockChance = difficulty === "easy" ? 0.32 : difficulty === "hard" ? 0.72 : 0.52;
      if (player.attack && distance < 160 && Math.random() < blockChance) cpu.aiBlock = difficulty === "hard" ? 0.42 : 0.26;
      else if (distance < 152) {
        const roll = Math.random();
        if (cpu.energy >= 100 && roll > 0.82) cpu.aiAttack = "super";
        else if (roll > 0.73) cpu.aiAttack = "kick"; else if (roll > 0.40) cpu.aiAttack = "punch"; else if (roll > 0.32) cpu.aiAttack = "grab";
      } else if (distance < 210 && Math.random() > 0.86) cpu.aiMove = 0;
    }
    const back = cpu.facing === 1 ? cpu.aiMove < 0 : cpu.aiMove > 0;
    const attack = cpu.aiAttack; cpu.aiAttack = null;
    return { left: cpu.aiMove < 0, right: cpu.aiMove > 0, down: false, jump: false, block: cpu.aiBlock > 0 || back && distance < 178, attack };
  }

  function spawnImpact(x, y, color, scale) { game.effects.push({ type: "impact", x, y, life: 0.27, max: 0.27, color, scale }); }
  function updateEffects(dt) {
    for (let i = game.effects.length - 1; i >= 0; i -= 1) {
      const effect = game.effects[i]; effect.life -= dt;
      if (effect.type === "paper") { effect.x += effect.vx * dt; effect.y += effect.vy * dt; effect.vy += 260 * dt; effect.spin += dt * 8; }
      if (effect.type === "chakra") {
        const progress = clamp(1 - effect.life / effect.max, 0, 1);
        effect.x = lerp(effect.fromX, effect.targetX, progress); effect.y = lerp(effect.fromY, effect.targetY, progress) - Math.sin(progress * Math.PI) * 28;
        effect.spin += dt * 18;
      }
      if (effect.type === "slam-ring") effect.spin += dt * 7;
      if (effect.type === "dust") { effect.x += effect.vx || 0; effect.life -= dt * 0.2; }
      if (effect.life <= 0) game.effects.splice(i, 1);
    }
    game.shake = Math.max(0, game.shake - dt * 34);
    if (game.callout) game.callout.time = Math.max(0, game.callout.time - dt);
  }

  function spawnBomb() {
    const safeGap = Math.abs(player.x - cpu.x);
    let x = safeGap > 210 ? (Math.random() > 0.5 ? player.x : cpu.x) : 230 + Math.random() * 500;
    x = clamp(x, 130, W - 130);
    game.bomb = { x, y: GROUND - 260, timer: 2.55, phase: "fall", fuse: 0, radius: 110 };
    announce("SUTLI BOMB! RING SE BAHAR BHAGO!", 2.4, "#ff9862");
    speakAnnouncement("Sutli bomb! Ring se bahar bhaago!", "hi-IN");
    playTone(760, 0.08, "square");
  }

  function updateBomb(dt) {
    if (!game.bomb) { game.bombClock -= dt; if (game.bombClock <= 0) spawnBomb(); return; }
    const bomb = game.bomb;
    if (bomb.phase === "fall") {
      bomb.y = Math.min(GROUND - 16, bomb.y + 500 * dt);
      if (bomb.y >= GROUND - 16) bomb.phase = "fuse";
    } else if (bomb.phase === "fuse") {
      bomb.timer -= dt; bomb.fuse += dt;
      if (bomb.timer <= 0) {
        game.effects.push({ type: "blast", x: bomb.x, y: GROUND - 8, life: 0.65, max: 0.65, color: "#ffb43f" });
        [player, cpu].forEach((fighter) => {
          if (Math.abs(fighter.x - bomb.x) < bomb.radius && fighter.health > 0) {
            fighter.takeHit(19, "kick", { facing: fighter.x < bomb.x ? -1 : 1, isPlayer: false });
            fighter.vy = -180; fighter.vx = fighter.x < bomb.x ? -230 : 230;
          }
        });
        game.shake = 13; playBombSound(); announce("DHADAM!", 0.8, "#ffc456");
        game.bomb = null; game.bombClock = 13 + Math.random() * 7;
      }
    }
  }

  function updateFight(dt) {
    if (!game || game.phase === "result" || game.paused) return;
    game.elapsed += dt;
    if (game.phase === "round-end") {
      game.breakTimer -= dt; updateEffects(dt);
      if (game.breakTimer <= 0 && game.nextRound) { game.nextRound = false; beginRound(); }
      return;
    }
    if (game.intro > 0) { game.intro -= dt; updateEffects(dt); return; }
    game.time = Math.max(0, game.time - dt);
    player.update(dt, getPlayerInput(), cpu);
    cpu.update(dt, settings.mode === "friend" ? getFriendInput() : getCpuInput(dt), player);
    if (player.x < cpu.x && player.x + 34 > cpu.x - 34) { const mid = (player.x + cpu.x) / 2; player.x = mid - 36; cpu.x = mid + 36; }
    updateBomb(dt); updateEffects(dt);
    if (player.health <= 0 || cpu.health <= 0) endRound("ko"); else if (game.time <= 0) endRound("time");
    updateHud();
  }

  function updateHud() {
    if (!player || !cpu || !game) return;
    ui.playerHealth.style.width = `${player.health}%`; ui.cpuHealth.style.width = `${cpu.health}%`;
    ui.playerEnergy.style.width = `${player.energy}%`; ui.cpuEnergy.style.width = `${cpu.energy}%`;
    ui.playerEnergy.parentElement.classList.toggle("super-ready", player.energy >= 100);
    ui.cpuEnergy.parentElement.classList.toggle("super-ready", cpu.energy >= 100);
    ui.timer.textContent = String(Math.ceil(game.time)).padStart(2, "0");
    ui.round.textContent = `ROUND ${Math.min(game.round, 3)}`;
    ui.combo.textContent = player.comboCount > 1 && player.comboTimer > 0 ? `${player.comboCount} HIT COMBO` : "";
    [...ui.playerRounds.children].forEach((dot, i) => dot.classList.toggle("won", i < game.playerRounds));
    [...ui.cpuRounds.children].forEach((dot, i) => dot.classList.toggle("won", i < game.cpuRounds));
    ui.bombWarning.classList.toggle("hidden", !game.bomb || game.bomb.phase !== "fuse");
  }

  function drawLantern(x, y, color, time, scale = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.strokeStyle = "#68483f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, -7); ctx.stroke();
    ctx.shadowColor = color; ctx.shadowBlur = 18 + Math.sin(time * 7 + x) * 4;
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-12, -7); ctx.lineTo(-9, -17); ctx.lineTo(9, -17); ctx.lineTo(12, -7); ctx.lineTo(8, 8); ctx.lineTo(-8, 8); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 0.55; ctx.fillStyle = "#fff5cf"; ctx.fillRect(-2, -13, 4, 16); ctx.restore();
  }

  function drawArchitecture(stage) {
    ctx.fillStyle = "#15152d"; ctx.fillRect(0, 280, W, 115);
    if (stage === "assembly") {
      ctx.fillStyle = "#303047"; ctx.fillRect(94, 222, 772, 116);
      ctx.fillStyle = "#514451"; ctx.fillRect(122, 207, 716, 24);
      ctx.fillStyle = "#8f6652"; ctx.fillRect(395, 184, 170, 31);
      ctx.beginPath(); ctx.ellipse(480, 183, 111, 36, 0, Math.PI, Math.PI * 2); ctx.fillStyle = "#987356"; ctx.fill();
      ctx.fillStyle = "#d8aa70"; ctx.fillRect(418, 160, 124, 23); ctx.beginPath(); ctx.ellipse(480, 160, 62, 18, 0, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#493c49"; ctx.fillRect(430, 232, 100, 106);
      for (let x = 150; x <= 806; x += 73) {
        ctx.fillStyle = "#78604f"; ctx.fillRect(x, 235, 15, 95);
        ctx.fillStyle = "#d3a56d"; ctx.fillRect(x - 5, 230, 25, 9); ctx.fillRect(x - 5, 324, 25, 9);
        ctx.fillStyle = "#e5bd7e"; ctx.globalAlpha = .68; ctx.fillRect(x + 4, 258, 5, 33); ctx.globalAlpha = 1;
      }
      ctx.fillStyle = "#30233a"; ctx.fillRect(0, 335, W, 36);
      ctx.fillStyle = "#ffdb86"; ctx.font = "bold 10px Trebuchet MS"; ctx.textAlign = "center"; ctx.fillText("JAN SABHA MAIDAN · DIWALI NIGHT", 480, 320);
    } else {
      ctx.fillStyle = "#29283d"; ctx.fillRect(50, 260, 860, 96);
      for (let i = 0; i < 5; i += 1) {
        const x = 145 + i * 168;
        ctx.fillStyle = "#927150"; ctx.fillRect(x, 190, 18, 145); ctx.fillRect(x - 22, 185, 62, 12); ctx.fillRect(x - 22, 327, 62, 12);
        ctx.fillStyle = "#38334a"; ctx.fillRect(x + 18, 211, 84, 124);
        ctx.strokeStyle = "#a7825b"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x + 61, 231, 40, Math.PI, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = "#f0c774"; ctx.font = "bold 11px Trebuchet MS"; ctx.textAlign = "center"; ctx.fillText("JANTAR PLAZA · FESTIVAL OF LIGHT", 480, 314);
    }
    for (let i = 0; i < 23; i += 1) {
      const x = i * 44 + 7; const bob = Math.sin(i * 3 + gameTime()) * 2;
      ctx.fillStyle = i % 3 === 0 ? "#59424a" : "#342e40"; ctx.beginPath(); ctx.arc(x, 372 + bob, 12, Math.PI, 0); ctx.lineTo(x + 12, 395); ctx.lineTo(x - 12, 395); ctx.fill();
      ctx.fillStyle = i % 2 ? "#e4aa70" : "#9dc4ba"; ctx.beginPath(); ctx.arc(x, 370 + bob, 5, 0, Math.PI * 2); ctx.fill();
    }
    const signs = ["VOTE!", "JAI HIND", "BADLAV", "SABAR RAKHO", "FESTIVAL!", "UNITY"];
    signs.forEach((word, i) => {
      const x = 31 + i * 166 + Math.sin(gameTime() * 1.5 + i) * 3;
      ctx.save(); ctx.translate(x, 362 + (i % 2) * 6); ctx.rotate((i % 2 ? -1 : 1) * 0.045);
      ctx.fillStyle = "#efe4c7"; roundedRect(ctx, -37, -22, 74, 34, 3); ctx.fill();
      ctx.fillStyle = i % 2 ? "#bd553e" : "#376756"; ctx.font = "bold 8px Trebuchet MS"; ctx.textAlign = "center"; ctx.fillText(word, 0, -2); ctx.restore();
    });
  }

  function gameTime() { return game ? game.elapsed : performance.now() / 1000; }

  function drawRangoli(time) {
    ctx.save(); ctx.translate(480, 457); ctx.globalAlpha = 0.92;
    const pulse = 1 + Math.sin(time * 1.6) * 0.018;
    for (let ring = 0; ring < 5; ring += 1) {
      ctx.save(); ctx.scale(pulse, pulse); ctx.strokeStyle = ["#e9b848", "#f0805a", "#49a68b", "#d8a2c7", "#f5d486"][ring]; ctx.lineWidth = ring === 0 ? 3 : 2;
      ctx.beginPath(); ctx.arc(0, 0, 15 + ring * 12, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i += 1) {
        ctx.save(); ctx.rotate(i * Math.PI / 4); ctx.beginPath(); ctx.ellipse(0, -(19 + ring * 11), 5, 12, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      ctx.restore();
    }
    ctx.fillStyle = "#f8d86f"; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  function drawDiya(x, y, time, scale = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.fillStyle = "#bd6739"; ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = "#ffbd49"; ctx.shadowBlur = 15; ctx.fillStyle = "#ffdc77";
    ctx.beginPath(); ctx.ellipse(0, -6 - Math.sin(time * 12 + x) * 1.4, 3.4, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawSansarSigns(time) {
    const signs = [{ x: 36, y: 328, text: "JAI HIND", color: "#df694b" }, { x: 914, y: 306, text: "VOTE!", color: "#477f62" }, { x: 873, y: 356, text: "BADLAV", color: "#4976b5" }];
    signs.forEach((sign, index) => {
      const bob = Math.sin(time * 2 + index) * 2;
      ctx.save(); ctx.translate(sign.x, sign.y + bob); ctx.rotate(index % 2 ? -.04 : .04);
      ctx.fillStyle = "#17192b"; ctx.fillRect(-2, 14, 4, 26);
      ctx.fillStyle = "#f0e4ca"; roundedRect(ctx, -29, -11, 58, 23, 3); ctx.fill();
      ctx.fillStyle = sign.color; ctx.font = "900 7px Trebuchet MS"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(sign.text, 0, 1); ctx.restore();
    });
  }

  function drawBackdrop(time, stage) {
    const image = arenaImages[stage];
    if (image && image.complete && image.naturalWidth > 0) ctx.drawImage(image, 0, 0, W, H);
    else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      if (stage === "market") { grad.addColorStop(0, "#171a3e"); grad.addColorStop(.52, "#63374e"); grad.addColorStop(1, "#21162d"); }
      else { grad.addColorStop(0, "#080f2a"); grad.addColorStop(.55, "#1b3151"); grad.addColorStop(1, "#32213b"); }
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H); drawArchitecture(stage);
    }
    const shade = ctx.createLinearGradient(0, 0, 0, H);
    shade.addColorStop(0, "#07102235"); shade.addColorStop(.56, "#0710220b"); shade.addColorStop(1, "#06101f56");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
    const floorShade = ctx.createLinearGradient(0, GROUND - 10, 0, H);
    floorShade.addColorStop(0, "#08102004"); floorShade.addColorStop(1, "#08102042");
    ctx.fillStyle = floorShade; ctx.fillRect(0, GROUND - 10, W, H - GROUND + 10);
    ctx.strokeStyle = "#fff0cf59"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, GROUND + 1); ctx.lineTo(W, GROUND + 1); ctx.stroke();
    for (let i = 0; i < 16; i += 1) {
      const x = (i * 127 + time * (i % 2 ? 8 : -5) + W) % W;
      const y = 75 + (i * 41) % (GROUND - 105); const alpha = .18 + (Math.sin(time * 2.5 + i) + 1) * .16;
      ctx.globalAlpha = alpha; ctx.fillStyle = i % 3 ? "#ffe6a6" : "#9de2d1"; ctx.beginPath(); ctx.arc(x, y, i % 4 === 0 ? 2 : 1.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.font = "bold 10px Trebuchet MS"; ctx.textAlign = "left";
    const stageTitle = stage === "sansar" ? "SANSAR  /  DIWALI SHOWDOWN" : stage === "assembly" ? "JAN SABHA MAIDAN  /  DIWALI NIGHT" : "JANTAR PLAZA  /  LIGHTS ON, GLOVES UP";
    ctx.lineWidth = 3; ctx.strokeStyle = "#071022bb"; ctx.strokeText(stageTitle, 24, 418);
    ctx.fillStyle = "#ffe0a1"; ctx.fillText(stageTitle, 24, 418);
    if (stage === "sansar") drawSansarSigns(time);
  }

  function drawMenuCanvas(time) {
    drawBackdrop(time, settings.stage);
    ctx.fillStyle = "#0b122c66"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i += 1) drawLantern(60 + i * 142, 56 + (i % 2) * 15, i % 2 ? "#e99856" : "#f2ca6f", time, .7);
    for (let i = 0; i < 11; i += 1) {
      ctx.strokeStyle = i % 2 ? "#f39c6240" : "#e5c56640"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40 + i * 92, 0); ctx.lineTo(180 + i * 92, H); ctx.stroke();
    }
  }

  function limb(x1, y1, x2, y2, width, color) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  function drawFighter(f, time) {
    const crouch = f.crouching ? 20 : 0;
    const walking = f.grounded && Math.abs(f.vx) > 45 && !f.attack;
    const bob = f.grounded && !f.attack ? Math.sin(f.anim) * (walking ? 4 : 2.1) : 0;
    const stride = walking ? Math.sin(f.step) * 13 : 0;
    const flash = f.hurtFlash > 0 && Math.floor(f.hurtFlash * 25) % 2 === 0;
    const body = flash ? "#fff" : f.color, dark = flash ? "#fff" : f.dark, accent = flash ? "#fff" : f.accent;
    ctx.save(); ctx.globalAlpha = .3; ctx.fillStyle = "#080a16"; ctx.beginPath(); ctx.ellipse(f.x, GROUND + 7, f.crouching ? 43 : 35, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(f.x, f.y + bob); ctx.scale(f.facing, 1);
    const attack = f.attack, supering = attack === "super";
    if (supering) {
      ctx.save(); ctx.globalAlpha = .25 + Math.sin(time * 16) * .08; ctx.strokeStyle = accent; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, -105, 82 + Math.sin(time * 15) * 8, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      for (let i = 0; i < 8; i += 1) { const a = time * 2 + i * Math.PI / 4; ctx.fillStyle = accent; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(Math.cos(a) * 57, -111 + Math.sin(a) * 48, 3, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1;
    }
    if (f.sprite && f.sprite.complete && f.sprite.naturalWidth > 0) {
      const leaning = f.hitstun > 0 ? -.12 : f.attack === "kick" ? -.14 : f.attack === "punch" || f.attack === "grab" ? .08 : 0;
      const lift = f.id === "mitraman" && supering ? 24 + Math.sin(time * 15) * 7 : 0;
      ctx.save(); ctx.translate(0, -94 - lift); ctx.rotate(f.specialSpin > 0 ? Math.sin(f.specialSpinAngle) * 1.08 : leaning); ctx.translate(0, 94 + crouch * .35);
      if (f.attack === "punch" || f.attack === "kick") {
        ctx.strokeStyle = f.attack === "kick" ? "#ef759288" : `${f.accent}88`; ctx.lineWidth = f.attack === "kick" ? 6 : 4;
        ctx.beginPath(); ctx.arc(f.attack === "kick" ? 35 : 57, -104 + crouch, 37, -.72, .56); ctx.stroke();
      }
      ctx.globalAlpha = flash ? .82 : 1; ctx.drawImage(f.sprite, -66, -200 + crouch, 132, 200 - crouch); ctx.globalAlpha = 1;
      if (f.blocking) { ctx.strokeStyle = "#fff1bd"; ctx.lineWidth = 4; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(33, -98 + crouch, 46, -1.15, 1.15); ctx.stroke(); }
      ctx.restore(); ctx.restore(); return;
    }
    const kick = attack === "kick";
    // Legs, ankle wraps and expressive footwork.
    limb(-13, -57 + crouch, -18 - stride, -23, 14, dark); limb(-18 - stride, -23, -29 - stride, -3, 9, body);
    limb(13, -57 + crouch, kick ? 62 : 18 + stride, kick ? -51 : -23, 14, dark);
    limb(kick ? 62 : 18 + stride, kick ? -51 : -23, kick ? 88 : 29 + stride, kick ? -45 : -3, 9, body);
    ctx.fillStyle = accent; roundedRect(ctx, -38 - stride, -10, 23, 9, 4); ctx.fill(); roundedRect(ctx, 20 + stride, -10, 23, 9, 4); ctx.fill();
    // Tunic or wrap with a crisp belt and seam details.
    ctx.fillStyle = dark; roundedRect(ctx, -32, -132 + crouch, 64, 84, 19); ctx.fill();
    ctx.fillStyle = body; roundedRect(ctx, -27, -128 + crouch, 54, 75, 16); ctx.fill();
    if (f.style === "sage") {
      ctx.fillStyle = "#fff9e8"; ctx.beginPath(); ctx.moveTo(-24, -52 + crouch); ctx.lineTo(0, -66 + crouch); ctx.lineTo(24, -52 + crouch); ctx.lineTo(33, -5); ctx.lineTo(14, -5); ctx.lineTo(0, -32); ctx.lineTo(-14, -5); ctx.lineTo(-34, -5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#d8bc88"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4, -116 + crouch); ctx.lineTo(15, -70 + crouch); ctx.stroke();
    } else {
      ctx.fillStyle = "#f1e6d4"; ctx.fillRect(-23, -56 + crouch, 46, 9);
      ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(-17, -123 + crouch); ctx.lineTo(-5, -89 + crouch); ctx.lineTo(-18, -67 + crouch); ctx.lineTo(-24, -73 + crouch); ctx.lineTo(-13, -90 + crouch); ctx.lineTo(-24, -117 + crouch); ctx.fill();
      ctx.fillStyle = "#edc66f"; roundedRect(ctx, -8, -103 + crouch, 16, 8, 3); ctx.fill();
    }
    ctx.fillStyle = accent; roundedRect(ctx, -26, -117 + crouch, 52, 12, 4); ctx.fill();
    // Rear arm and action arm, animated into a readable strike pose.
    limb(-23, -105 + crouch, -49, -76 + crouch, 12, dark); limb(-49, -76 + crouch, -55, -69 + crouch, 10, f.skin);
    let handX = 50, handY = -95 + crouch;
    if (attack === "punch" || attack === "grab" || supering) { handX = supering ? 111 : attack === "grab" ? 72 : 86; handY = supering ? -115 + crouch : -105 + crouch; }
    else if (f.blocking) { handX = 43; handY = -123 + crouch; }
    limb(22, -105 + crouch, handX, handY, 13, dark); limb(handX - 3, handY, handX, handY, 10, f.skin);
    ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(handX, handY, supering ? 16 : 9, 0, Math.PI * 2); ctx.fill();
    // Real, attributed portrait crops give the satirical roster an immediate likeness.
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(0, -157 + crouch, 29, 0, Math.PI * 2); ctx.fill();
    if (f.portraitImage && f.portraitImage.complete && f.portraitImage.naturalWidth > 0) {
      const [cx, cy, cw, ch] = f.faceCrop;
      ctx.save(); ctx.beginPath(); ctx.arc(0, -157 + crouch, 24, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(f.portraitImage, cx * f.portraitImage.naturalWidth, cy * f.portraitImage.naturalHeight, cw * f.portraitImage.naturalWidth, ch * f.portraitImage.naturalHeight, -24, -181 + crouch, 48, 48);
      ctx.restore(); ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, -157 + crouch, 24, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = f.skin; ctx.beginPath(); ctx.ellipse(0, -158 + crouch, 24, 26, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = f.hair;
      if (f.style === "sage") { ctx.beginPath(); ctx.arc(0, -177 + crouch, 22, Math.PI, Math.PI * 2); ctx.fill(); }
      else {
        ctx.beginPath(); ctx.arc(0, -163 + crouch, 25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = f.hair; ctx.beginPath(); ctx.moveTo(-18, -147 + crouch); ctx.quadraticCurveTo(-27, -119 + crouch, 0, -125 + crouch); ctx.quadraticCurveTo(25, -120 + crouch, 18, -147 + crouch); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = accent; roundedRect(ctx, -24, -180 + crouch, 48, 9, 4); ctx.fill();
      if (f.style === "sage") {
        ctx.strokeStyle = "#493b31"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(-8, -157 + crouch, 7, 6, 0, 0, Math.PI * 2); ctx.ellipse(8, -157 + crouch, 7, 6, 0, 0, Math.PI * 2); ctx.moveTo(-1, -157 + crouch); ctx.lineTo(1, -157 + crouch); ctx.stroke();
        ctx.fillStyle = "#57483e"; ctx.fillRect(-3, -150 + crouch, 6, 2);
      } else {
        ctx.strokeStyle = "#594036"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -160 + crouch); ctx.lineTo(-5, -158 + crouch); ctx.moveTo(5, -158 + crouch); ctx.lineTo(14, -160 + crouch); ctx.stroke();
        ctx.fillStyle = "#754d3f"; ctx.beginPath(); ctx.arc(0, -150 + crouch, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.fillStyle = accent; ctx.font = "bold 8px Trebuchet MS"; ctx.textAlign = "center"; ctx.fillText(f.name.split(" ")[0], 0, -78 + crouch);
    if (f.blocking) { ctx.strokeStyle = "#fff1bd"; ctx.lineWidth = 4; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(34, -95 + crouch, 37, -1.15, 1.15); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.restore();
  }

  function drawBomb(time) {
    if (!game || !game.bomb) return;
    const bomb = game.bomb; const pulse = 1 + Math.sin(time * 18) * .15;
    if (bomb.phase === "fuse") {
      ctx.save(); ctx.globalAlpha = .22 + Math.sin(time * 13) * .08; ctx.fillStyle = "#ff5a3f";
      ctx.beginPath(); ctx.ellipse(bomb.x, GROUND, bomb.radius * pulse, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#ffad58"; ctx.lineWidth = 2; ctx.setLineDash([7, 8]); ctx.beginPath(); ctx.ellipse(bomb.x, GROUND, bomb.radius, 18, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.save(); ctx.translate(bomb.x, bomb.y); ctx.fillStyle = "#252434"; ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#e4d4bd"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(5, 10); ctx.moveTo(5, -10); ctx.lineTo(-5, 10); ctx.stroke();
    ctx.strokeStyle = "#e1b26e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(4, -11); ctx.quadraticCurveTo(12, -24, 18, -19); ctx.stroke();
    ctx.fillStyle = "#ffcf53"; ctx.shadowColor = "#ff7b36"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(18, -20, 4 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  function drawEffects() {
    game.effects.forEach((effect) => {
      const alpha = clamp(effect.life / effect.max, 0, 1); ctx.save(); ctx.globalAlpha = alpha;
      if (effect.type === "impact") {
        const size = (1 - alpha) * 46 * effect.scale; ctx.strokeStyle = effect.color; ctx.lineWidth = 4;
        for (let i = 0; i < 9; i += 1) { const a = i * Math.PI / 4.5; ctx.beginPath(); ctx.moveTo(effect.x + Math.cos(a) * 6, effect.y + Math.sin(a) * 6); ctx.lineTo(effect.x + Math.cos(a) * (size + 19), effect.y + Math.sin(a) * (size + 19)); ctx.stroke(); }
      } else if (effect.type === "wave") {
        ctx.strokeStyle = effect.color; ctx.lineWidth = 9; ctx.shadowColor = effect.color; ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.arc(effect.x, effect.y, 28 + (1 - alpha) * 95, 0, Math.PI * 2); ctx.stroke();
      } else if (effect.type === "chakra") {
        ctx.translate(effect.x, effect.y); ctx.rotate(effect.spin); ctx.shadowColor = effect.color; ctx.shadowBlur = 17;
        ctx.fillStyle = "#f5cf4d"; ctx.beginPath(); ctx.arc(0, 0, 18 + alpha * 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#fff0a4"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 25 + alpha * 5, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "#e88b38"; ctx.lineWidth = 2;
        for (let i = 0; i < 8; i += 1) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, -35); ctx.stroke(); }
      } else if (effect.type === "slam-ring") {
        const radius = 24 + (1 - alpha) * 120; ctx.translate(effect.x, effect.y); ctx.rotate(effect.spin);
        ctx.strokeStyle = effect.color; ctx.shadowColor = effect.color; ctx.shadowBlur = 20; ctx.lineWidth = 8 * alpha + 2;
        ctx.beginPath(); ctx.ellipse(0, 0, radius, radius * .25, 0, 0, Math.PI * 2); ctx.stroke();
      } else if (effect.type === "paper") {
        ctx.translate(effect.x, effect.y); ctx.rotate(effect.spin); ctx.fillStyle = effect.color; ctx.fillRect(-7, -4, 14, 9); ctx.strokeStyle = "#c9bda3"; ctx.lineWidth = .7; ctx.strokeRect(-7, -4, 14, 9);
      } else if (effect.type === "blast") {
        ctx.fillStyle = "#ffb43f"; ctx.shadowColor = "#ff7a3c"; ctx.shadowBlur = 28; ctx.beginPath(); ctx.arc(effect.x, effect.y, (1 - alpha) * 120, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff3b2"; ctx.beginPath(); ctx.arc(effect.x, effect.y, (1 - alpha) * 68, 0, Math.PI * 2); ctx.fill();
      } else if (effect.type === "dust") {
        ctx.fillStyle = effect.color; ctx.beginPath(); ctx.arc(effect.x, effect.y, (1 - alpha) * 17 + 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawFight(time) {
    drawBackdrop(time, settings.stage);
    const shakeX = game ? (Math.random() - .5) * game.shake : 0; const shakeY = game ? (Math.random() - .5) * game.shake : 0;
    ctx.save(); ctx.translate(shakeX, shakeY);
    drawBomb(time);
    if (player && cpu) { drawFighter(player, time); drawFighter(cpu, time); }
    if (game) drawEffects();
    if (game && game.intro > 0) {
      ctx.fillStyle = "#080d20a8"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#f7d77c"; ctx.font = "900 47px Trebuchet MS"; ctx.textAlign = "center";
      ctx.shadowColor = "#ef784a"; ctx.shadowBlur = 15;
      ctx.fillText(game.intro > 1.05 ? `ROUND ${game.round}` : "FIGHT!", W / 2, 248); ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  function render(time) {
    ctx.clearRect(0, 0, W, H);
    if (screen === "fight" || screen === "result" && game) drawFight(time); else drawMenuCanvas(time);
    if (screen === "title") {
      ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = "#f3cf75"; ctx.font = "900 118px Trebuchet MS"; ctx.textAlign = "left"; ctx.fillText("RR", 60, 150); ctx.restore();
    }
  }

  function gameLoop(now) {
    const dt = Math.min(.034, (now - lastFrame) / 1000); lastFrame = now;
    updateFight(dt); render(now / 1000); justPressed.clear(); requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (screen !== "fight" || !game || game.phase !== "fight") return;
    game.paused = !game.paused; ui.pause.classList.toggle("hidden", !game.paused);
    if (game.paused) { playTone(175, 0.06, "square"); keys.clear(); }
  }
  function normalizeKey(key) { return key.length === 1 ? key.toLowerCase() : key; }

  function updateSelectionUI() {
    if (settings.playerFighter === settings.cpuFighter) {
      settings.cpuFighter = Object.keys(fighterData).find((id) => id !== settings.playerFighter);
    }
    document.querySelectorAll(".fighter-card").forEach((card) => {
      const isPlayer = card.dataset.fighter === settings.playerFighter;
      const isCpu = card.dataset.fighter === settings.cpuFighter;
      card.classList.toggle("selected", isPlayer); card.classList.toggle("cpu-opponent", isCpu);
      card.querySelector(".card-ribbon").textContent = isPlayer ? "1P · YOU" : isCpu ? settings.mode === "friend" ? "PLAYER 2" : "CPU RIVAL" : "AVAILABLE";
    });
    ui.cpuPreviewName.textContent = fighterData[settings.cpuFighter].name;
    ui.rivalLabel.textContent = settings.mode === "friend" ? "PLAYER TWO" : "CPU OPPONENT";
    ui.modeLabel.textContent = settings.mode === "friend" ? "LOCAL 2P · KEYBOARD" : "1P VS CPU";
    ui.cpuCycle.textContent = settings.mode === "friend" ? "CHANGE PLAYER 2 ↻" : "CHANGE RIVAL ↻";
    ui.cpuCycle.setAttribute("aria-label", settings.mode === "friend" ? "Choose Player 2 fighter" : "Choose next CPU opponent");
    document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === settings.mode));
  }

  function cycleCpuRival() {
    const opponents = Object.keys(fighterData).filter((id) => id !== settings.playerFighter);
    const current = opponents.indexOf(settings.cpuFighter);
    settings.cpuFighter = opponents[(current + 1) % opponents.length]; updateSelectionUI();
    ensureAudio(); playTone(445, .05, "triangle");
  }

  window.addEventListener("keydown", (event) => {
    const key = normalizeKey(event.key);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) event.preventDefault();
    if (!ui.legalGate.classList.contains("hidden")) { if (key === "Enter") ui.acceptNotice.click(); return; }
    if (key === "Escape") { togglePause(); return; }
    if (key === "m") { toggleSound(); return; }
    if (key === "n") { cycleMusic(); return; }
    if (screen === "title" && key === "Enter") { startSelect(); return; }
    if (screen === "select" && key === "Enter") { startFight(); return; }
    if (screen === "result" && key === "Enter") { createGame(); return; }
    if (!keys.has(key)) justPressed.add(key); keys.add(key);
  });
  window.addEventListener("keyup", (event) => keys.delete(normalizeKey(event.key)));
  window.addEventListener("blur", () => keys.clear());

  document.getElementById("startButton").addEventListener("click", startSelect);
  document.getElementById("backToTitle").addEventListener("click", () => setScreen("title"));
  document.getElementById("fightButton").addEventListener("click", startFight);
  document.getElementById("rematchButton").addEventListener("click", createGame);
  document.getElementById("selectAgainButton").addEventListener("click", () => setScreen("select"));
  document.getElementById("resumeButton").addEventListener("click", togglePause);
  document.getElementById("quitButton").addEventListener("click", () => { if (game) game.phase = "quit"; setScreen("select"); });
  ui.acceptNotice.addEventListener("click", () => {
    try { localStorage.setItem("rally-rumble-satire-acknowledged", "yes"); } catch (_) { /* Storage may be disabled. */ }
    ui.legalGate.classList.add("hidden"); document.getElementById("startButton").focus();
  });
  document.querySelectorAll("[data-post-action]").forEach((button) => button.addEventListener("click", async () => {
    const action = button.dataset.postAction;
    if (action === "card") {
      const shareText = `${ui.paperHeadline.textContent} — Sansad Times: ${ui.resultRounds.textContent}`;
      try {
        if (navigator.share) { await navigator.share({ title: "Sansad Times", text: shareText }); ui.postActionMessage.textContent = "DIWALI CARD READY TO SHARE."; }
        else if (navigator.clipboard) { await navigator.clipboard.writeText(shareText); ui.postActionMessage.textContent = "DIWALI CARD CAPTION COPIED."; }
        else ui.postActionMessage.textContent = shareText;
      } catch (_) { ui.postActionMessage.textContent = "YOUR SANSAD TIMES CARD IS READY."; }
    } else if (action === "feedback") ui.postActionMessage.textContent = "MAZAA AAYA — THANKS FOR PLAYING! NOTHING WAS SENT.";
    else ui.postActionMessage.textContent = "VIRTUAL CHAI SERVED. NO PAYMENT IS REQUESTED.";
  }));
  ui.sound.addEventListener("click", toggleSound);
  ui.music.addEventListener("click", cycleMusic);
  ui.cpuCycle.addEventListener("click", cycleCpuRival);

  document.querySelectorAll(".fighter-card").forEach((card) => card.addEventListener("click", () => {
    settings.playerFighter = card.dataset.fighter; updateSelectionUI();
    ensureAudio(); playTone(430, 0.05, "triangle");
  }));
  document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-stage]").forEach((item) => item.classList.remove("active")); button.classList.add("active"); settings.stage = button.dataset.stage; playTone(410, 0.045, "sine");
  }));
  document.querySelectorAll("[data-difficulty]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-difficulty]").forEach((item) => item.classList.remove("active")); button.classList.add("active"); settings.difficulty = button.dataset.difficulty;
  }));
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
    settings.mode = button.dataset.mode; updateSelectionUI(); playTone(430, .045, "triangle");
  }));

  document.querySelectorAll("[data-action]").forEach((button) => {
    const queue = (event) => {
      event.preventDefault(); if (screen !== "fight" || !game || game.paused || game.intro > 0 || game.phase !== "fight") return;
      ensureAudio(); touchAttack = button.dataset.action; justPressed.add(`touch-${button.dataset.action}`);
      if (player) player.perform(touchAttack); touchAttack = null;
    };
    button.addEventListener("pointerdown", queue);
  });

  if (ui.stick) {
    const setStick = (event) => {
      if (touchStickPointer !== event.pointerId) return;
      const rect = ui.stick.getBoundingClientRect();
      const cx = touchStickOrigin ? touchStickOrigin.x : rect.left + rect.width / 2;
      const cy = touchStickOrigin ? touchStickOrigin.y : rect.top + rect.height / 2;
      const dx = event.clientX - cx, dy = event.clientY - cy; const radius = Math.min(rect.width, rect.height) * .34;
      const distance = Math.hypot(dx, dy); const scale = Math.min(1, radius / (distance || 1));
      ui.stickKnob.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].forEach((key) => keys.delete(key));
      if (Math.abs(dx) > 12) keys.add(dx < 0 ? "ArrowLeft" : "ArrowRight");
      if (Math.abs(dy) > 15) keys.add(dy < 0 ? "ArrowUp" : "ArrowDown");
    };
    const releaseStick = (event) => {
      if (touchStickPointer !== event.pointerId) return;
      touchStickPointer = null; touchStickOrigin = null; ui.stickKnob.style.transform = "translate(0, 0)";
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].forEach((key) => keys.delete(key));
    };
    ui.stick.addEventListener("pointerdown", (event) => { event.preventDefault(); ensureAudio(); touchStickPointer = event.pointerId; touchStickOrigin = { x: event.clientX, y: event.clientY }; ui.stick.setPointerCapture(event.pointerId); setStick(event); });
    ui.stick.addEventListener("pointermove", setStick); ui.stick.addEventListener("pointerup", releaseStick); ui.stick.addEventListener("pointercancel", releaseStick);
  }

  function ensureAudio() {
    if (!soundOn) return null;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();
      return audioContext;
    } catch (_) { return null; }
  }
  function playTone(frequency, duration, type = "sine", volume = 0.045) {
    if (!soundOn) return; const audio = ensureAudio(); if (!audio) return;
    try {
      const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
      gain.gain.setValueAtTime(volume, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch (_) { /* Audio support varies by browser. */ }
  }
  function playNoise(duration = 0.11, volume = 0.12, highpass = 400) {
    const audio = ensureAudio(); if (!audio) return;
    try {
      const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate); const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const source = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain();
      source.buffer = buffer; filter.type = "highpass"; filter.frequency.value = highpass; gain.gain.value = volume;
      source.connect(filter); filter.connect(gain); gain.connect(audio.destination); source.start();
    } catch (_) { /* Optional synthesized effects. */ }
  }
  function playActionSound(type) {
    if (type === "punch") { playNoise(.065, .10, 250); playTone(190, .055, "triangle", .035); }
    else if (type === "kick") { playNoise(.10, .15, 170); playTone(135, .09, "sawtooth", .04); }
    else if (type === "grab") { playTone(280, .08, "triangle", .045); playTone(430, .11, "sine", .025); }
    else { playTone(100, .26, "sawtooth", .07); playNoise(.17, .09, 800); }
  }
  function playImpactSound(type) { playNoise(type === "super" ? .24 : .12, type === "super" ? .21 : .15, 120); playTone(type === "super" ? 65 : 115, type === "super" ? .24 : .07, "sawtooth", .045); }
  function playBombSound() { playNoise(.42, .26, 80); playTone(55, .36, "sawtooth", .08); window.setTimeout(() => playTone(310, .15, "triangle", .04), 55); }
  function startMusic() {
    if (!soundOn || !ui.musicPlayer) return;
    const track = musicTracks[musicIndex];
    if (ui.musicPlayer.dataset.trackIndex !== String(musicIndex)) {
      ui.musicPlayer.pause(); ui.musicPlayer.src = track.src; ui.musicPlayer.dataset.trackIndex = String(musicIndex); ui.musicPlayer.load();
    }
    ui.musicPlayer.volume = .30;
    const playback = ui.musicPlayer.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
  }
  function stopMusic() { if (ui.musicPlayer) ui.musicPlayer.pause(); }
  function updateMusicButton() {
    const track = musicTracks[musicIndex]; ui.music.textContent = track.label;
    ui.music.setAttribute("aria-label", `Change soundtrack. Current track: ${track.name}`); ui.music.title = track.name;
  }
  function cycleMusic() {
    musicIndex = (musicIndex + 1) % musicTracks.length; updateMusicButton();
    if (soundOn) startMusic(); playTone(440, .05, "triangle");
  }
  function toggleSound() {
    soundOn = !soundOn; ui.sound.textContent = soundOn ? "AUDIO ON" : "AUDIO OFF";
    ui.sound.setAttribute("aria-pressed", String(soundOn));
    if (soundOn) { ensureAudio(); startMusic(); playTone(490, .055, "triangle"); }
    else { stopMusic(); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }
  }
  function speakAnnouncement(text, lang) {
    if (!soundOn || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = lang; utterance.rate = 1.04; utterance.pitch = 1.02; utterance.volume = .72;
      const voices = window.speechSynthesis.getVoices(); const voice = voices.find((item) => item.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2)));
      if (voice) utterance.voice = voice; window.speechSynthesis.speak(utterance);
    } catch (_) { /* Browser voice packs are optional. */ }
  }

  try { if (localStorage.getItem("rally-rumble-satire-acknowledged") === "yes") ui.legalGate.classList.add("hidden"); } catch (_) { /* Storage may be disabled. */ }
  updateSelectionUI(); updateMusicButton(); setScreen("title"); requestAnimationFrame(gameLoop);
})();
