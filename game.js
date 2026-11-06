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
  let lastFrame = performance.now();
  let screen = "title";
  let player = null;
  let cpu = null;
  let game = null;

  const fighterData = {
    neon: { name: "NEON BHAI", title: "THE NIGHT RUNNER", color: "#42d9dc", accent: "#ffd447", dark: "#0b7182" },
    road: { name: "ROAD RANI", title: "THE BLOCK PARTY", color: "#ff4f9a", accent: "#ffb34a", dark: "#95285e" }
  };

  const settings = { playerFighter: "neon", cpuFighter: "road", stage: "rooftop", difficulty: "normal" };

  const attackData = {
    punch: { duration: 0.28, activeStart: 0.14, activeEnd: 0.23, damage: 6, range: 104, knockback: 85, meter: 8, color: "#42d9dc" },
    kick: { duration: 0.42, activeStart: 0.20, activeEnd: 0.32, damage: 10, range: 122, knockback: 150, meter: 12, color: "#ff4f9a" },
    grab: { duration: 0.48, activeStart: 0.24, activeEnd: 0.37, damage: 14, range: 91, knockback: 225, meter: 16, color: "#ffd447" },
    super: { duration: 0.8, activeStart: 0.28, activeEnd: 0.62, damage: 28, range: 235, knockback: 340, meter: 0, color: "#ff704d" }
  };

  const ui = {
    title: document.getElementById("titleScreen"),
    select: document.getElementById("selectScreen"),
    result: document.getElementById("resultScreen"),
    pause: document.getElementById("pauseOverlay"),
    hud: document.getElementById("hud"),
    touch: document.getElementById("touchControls"),
    sound: document.getElementById("soundToggle"),
    playerHealth: document.getElementById("playerHealth"),
    playerEnergy: document.getElementById("playerEnergy"),
    cpuHealth: document.getElementById("cpuHealth"),
    cpuEnergy: document.getElementById("cpuEnergy"),
    playerName: document.getElementById("playerName"),
    cpuName: document.getElementById("cpuName"),
    timer: document.getElementById("timer"),
    combo: document.getElementById("comboText"),
    resultTitle: document.getElementById("resultTitle"),
    resultSub: document.getElementById("resultSub"),
    cpuPreviewName: document.getElementById("cpuPreviewName")
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function setScreen(next) {
    screen = next;
    [ui.title, ui.select, ui.result].forEach((node) => node.classList.add("hidden"));
    ui.pause.classList.add("hidden");
    ui.hud.classList.toggle("hidden", next !== "fight");
    ui.touch.classList.toggle("hidden", next !== "fight");
    if (next === "title") ui.title.classList.remove("hidden");
    if (next === "select") ui.select.classList.remove("hidden");
    if (next === "result") ui.result.classList.remove("hidden");
  }

  function startSelect() {
    playTone(420, 0.06, "square");
    setScreen("select");
  }

  function createGame() {
    player = new Fighter(fighterData[settings.playerFighter], 260, 1, true);
    cpu = new Fighter(fighterData[settings.cpuFighter], 700, -1, false);
    game = {
      time: 60,
      intro: 1.4,
      paused: false,
      phase: "fight",
      effects: [],
      shake: 0,
      winner: null,
      message: "",
      lastWinner: null
    };
    ui.playerName.textContent = fighterData[settings.playerFighter].name;
    ui.cpuName.textContent = fighterData[settings.cpuFighter].name;
    setScreen("fight");
    playTone(240, 0.08, "sawtooth");
  }

  function startFight() { createGame(); }

  function finishFight(reason) {
    if (!game || game.phase !== "fight") return;
    game.phase = "result";
    const draw = (player.health <= 0 && cpu.health <= 0) || (Math.abs(player.health - cpu.health) < 1 && reason === "time");
    const playerWins = !draw && player.health > cpu.health;
    game.winner = draw ? "DRAW" : playerWins ? "YOU WIN!" : "CPU WINS";
    game.message = draw ? "Nobody blinked. Run it back." : playerWins ? "That was a clean combo." : "The CPU stole the round. Try a different angle.";
    ui.resultTitle.textContent = game.winner;
    ui.resultSub.textContent = game.message;
    playTone(playerWins ? 640 : 150, 0.2, playerWins ? "triangle" : "sawtooth");
    setTimeout(() => setScreen("result"), 420);
  }

  class Fighter {
    constructor(data, x, facing, isPlayer) {
      this.name = data.name;
      this.title = data.title;
      this.color = data.color;
      this.accent = data.accent;
      this.dark = data.dark;
      this.x = x;
      this.y = GROUND;
      this.vx = 0;
      this.vy = 0;
      this.facing = facing;
      this.health = 100;
      this.energy = 20;
      this.isPlayer = isPlayer;
      this.width = 55;
      this.height = 158;
      this.attack = null;
      this.attackTimer = 0;
      this.attackHit = false;
      this.hitstun = 0;
      this.hurtFlash = 0;
      this.blocking = false;
      this.crouching = false;
      this.comboCount = 0;
      this.comboTimer = 0;
      this.aiClock = 0;
      this.aiBlock = 0;
      this.aiAttack = null;
      this.aiMove = 0;
      this.anim = Math.random() * 10;
    }

    get grounded() { return this.y >= GROUND - 1; }

    reset(x, facing) {
      this.x = x; this.y = GROUND; this.vx = 0; this.vy = 0; this.facing = facing;
      this.health = 100; this.energy = 20; this.attack = null; this.attackTimer = 0;
      this.attackHit = false; this.hitstun = 0; this.hurtFlash = 0; this.blocking = false;
      this.crouching = false; this.comboCount = 0; this.comboTimer = 0; this.aiClock = 0;
      this.aiBlock = 0; this.aiAttack = null; this.aiMove = 0;
    }

    perform(type) {
      if (!type || this.attack || this.hitstun > 0 || !this.grounded) return false;
      if (!attackData[type]) return false;
      if (type === "super" && this.energy < 100) return false;
      this.attack = type;
      this.attackTimer = attackData[type].duration;
      this.attackHit = false;
      this.blocking = false;
      if (type === "super") this.energy = 0;
      playTone(type === "kick" ? 180 : type === "super" ? 90 : 320, type === "super" ? 0.16 : 0.05, type === "super" ? "sawtooth" : "square");
      return true;
    }

    takeHit(amount, attackType, attacker) {
      if (this.hitstun > 0) return;
      const blocked = this.blocking && this.grounded && attackType !== "grab" && attackType !== "super";
      const actual = blocked ? amount * 0.18 : amount;
      this.health = clamp(this.health - actual, 0, 100);
      this.energy = clamp(this.energy + (blocked ? 6 : amount * 0.9), 0, 100);
      this.hitstun = blocked ? 0.08 : attackType === "super" ? 0.42 : 0.22;
      this.hurtFlash = blocked ? 0.08 : 0.14;
      this.vx = attacker.facing * (blocked ? 35 : attackData[attackType].knockback);
      if (!blocked) {
        this.vy = attackType === "super" ? -180 : -65;
        game.shake = attackType === "super" ? 16 : 7;
        spawnImpact(this.x, this.y - 90, attackData[attackType].color, attackType === "super" ? 1.5 : 1);
        playTone(attackType === "super" ? 80 : 120, 0.07, "sawtooth");
      } else {
        spawnImpact(this.x, this.y - 96, "#dbe8ff", 0.55);
        playTone(210, 0.04, "square");
      }
      if (attacker.isPlayer) {
        attacker.comboCount = attacker.comboTimer > 0 ? attacker.comboCount + 1 : 1;
        attacker.comboTimer = 0.9;
      }
    }

    update(dt, input, enemy) {
      this.anim += dt * (this.grounded ? 7 : 2);
      this.hitstun = Math.max(0, this.hitstun - dt);
      this.hurtFlash = Math.max(0, this.hurtFlash - dt);
      this.aiBlock = Math.max(0, this.aiBlock - dt);
      this.comboTimer = Math.max(0, this.comboTimer - dt);
      if (this.comboTimer === 0) this.comboCount = 0;
      this.facing = enemy.x >= this.x ? 1 : -1;

      if (this.attack) {
        this.attackTimer -= dt;
        const spec = attackData[this.attack];
        const elapsed = spec.duration - this.attackTimer;
        if (!this.attackHit && elapsed >= spec.activeStart && elapsed <= spec.activeEnd) {
          this.attackHit = true;
          const distance = Math.abs(enemy.x - this.x);
          const vertical = Math.abs((enemy.y - enemy.height) - (this.y - this.height));
          if (distance <= spec.range && vertical < 105) {
            enemy.takeHit(spec.damage, this.attack, this);
            this.energy = clamp(this.energy + spec.meter, 0, 100);
          }
          if (this.attack === "super") {
            game.effects.push({ type: "wave", x: this.x + this.facing * 74, y: this.y - 104, life: 0.34, max: 0.34, color: this.accent, dir: this.facing });
          }
        }
        if (this.attackTimer <= 0) this.attack = null;
      }

      if (this.hitstun <= 0 && !this.attack) {
        const left = !!input.left;
        const right = !!input.right;
        const dir = right ? 1 : left ? -1 : 0;
        this.crouching = !!input.down && this.grounded;
        this.blocking = !!input.block && this.grounded && !this.crouching;
        if (input.attack) this.perform(input.attack);
        if (input.jump && this.grounded && !this.crouching) this.vy = -690;
        if (!this.blocking && !this.crouching && !this.attack) this.vx = lerp(this.vx, dir * 265, Math.min(1, dt * 12));
        else if (this.blocking) this.vx = lerp(this.vx, 0, Math.min(1, dt * 16));
        else this.vx = lerp(this.vx, 0, Math.min(1, dt * 14));
      } else {
        this.blocking = false;
        this.crouching = false;
        this.vx = lerp(this.vx, 0, Math.min(1, dt * 4));
      }

      this.vy += gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.y >= GROUND) { this.y = GROUND; this.vy = 0; }
      this.x = clamp(this.x, 80, W - 80);
    }
  }

  function getPlayerInput() {
    const left = keys.has("a") || keys.has("ArrowLeft");
    const right = keys.has("d") || keys.has("ArrowRight");
    const down = keys.has("s") || keys.has("ArrowDown");
    const jump = keys.has("w") || keys.has("ArrowUp");
    const back = player && player.facing === 1 ? left : right;
    let attack = null;
    if (justPressed.has("j")) attack = "punch";
    else if (justPressed.has("k")) attack = "kick";
    else if (justPressed.has("i")) attack = "grab";
    else if (justPressed.has("l") || justPressed.has(" ")) attack = "super";
    return { left, right, down, jump, block: back, attack };
  }

  function getCpuInput(dt) {
    const distance = Math.abs(player.x - cpu.x);
    cpu.aiClock -= dt;
    if (cpu.aiClock <= 0) {
      const difficulty = settings.difficulty;
      const reaction = difficulty === "easy" ? 0.48 : difficulty === "hard" ? 0.20 : 0.32;
      cpu.aiClock = reaction + Math.random() * 0.18;
      cpu.aiMove = distance > 150 ? Math.sign(player.x - cpu.x) : 0;
      cpu.aiAttack = null;
      if (player.attack && distance < 155 && Math.random() > (difficulty === "easy" ? 0.66 : 0.28)) {
        cpu.aiBlock = difficulty === "hard" ? 0.38 : 0.25;
      } else if (distance < 145) {
        const roll = Math.random();
        if (cpu.energy >= 100 && roll > 0.65) cpu.aiAttack = "super";
        else if (roll > 0.72) cpu.aiAttack = "kick";
        else if (roll > 0.46) cpu.aiAttack = "punch";
        else if (roll > 0.38) cpu.aiAttack = "grab";
      }
    }
    const back = cpu.facing === 1 ? cpu.aiMove < 0 : cpu.aiMove > 0;
    const attack = cpu.aiAttack;
    cpu.aiAttack = null;
    return { left: cpu.aiMove < 0, right: cpu.aiMove > 0, down: false, jump: false, block: cpu.aiBlock > 0 || back && distance < 170, attack };
  }

  function spawnImpact(x, y, color, scale) {
    game.effects.push({ type: "impact", x, y, life: 0.26, max: 0.26, color, scale });
  }

  function updateEffects(dt) {
    for (let i = game.effects.length - 1; i >= 0; i -= 1) {
      game.effects[i].life -= dt;
      if (game.effects[i].life <= 0) game.effects.splice(i, 1);
    }
    game.shake = Math.max(0, game.shake - dt * 34);
  }

  function updateFight(dt) {
    if (!game || game.phase !== "fight" || game.paused) return;
    if (game.intro > 0) {
      game.intro -= dt;
      updateEffects(dt);
      return;
    }
    game.time = Math.max(0, game.time - dt);
    const pInput = getPlayerInput();
    const cInput = getCpuInput(dt);
    player.update(dt, pInput, cpu);
    cpu.update(dt, cInput, player);
    if (player.x < cpu.x && player.x + 34 > cpu.x - 34) { const mid = (player.x + cpu.x) / 2; player.x = mid - 35; cpu.x = mid + 35; }
    updateEffects(dt);
    if (player.health <= 0 || cpu.health <= 0) finishFight("ko");
    else if (game.time <= 0) finishFight("time");
    updateHud();
  }

  function updateHud() {
    if (!player || !cpu) return;
    ui.playerHealth.style.width = `${player.health}%`;
    ui.cpuHealth.style.width = `${cpu.health}%`;
    ui.playerEnergy.style.width = `${player.energy}%`;
    ui.cpuEnergy.style.width = `${cpu.energy}%`;
    ui.timer.textContent = String(Math.ceil(game.time)).padStart(2, "0");
    ui.combo.textContent = player.comboCount > 1 && player.comboTimer > 0 ? `${player.comboCount} HIT COMBO` : "";
  }

  function drawBackdrop(time, stage) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    if (stage === "market") { grad.addColorStop(0, "#481f50"); grad.addColorStop(0.52, "#d15c55"); grad.addColorStop(1, "#251533"); }
    else { grad.addColorStop(0, "#111b45"); grad.addColorStop(0.6, "#304c75"); grad.addColorStop(1, "#15182e"); }
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = .82;
    ctx.fillStyle = stage === "market" ? "#ffcf69" : "#ffd447";
    ctx.beginPath(); ctx.arc(stage === "market" ? 155 : 780, 105, stage === "market" ? 47 : 64, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .25; ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 4; i += 1) { ctx.fillRect(0, 160 + i * 30, W, 2); }
    ctx.restore();

    ctx.fillStyle = "#0d1630";
    for (let i = 0; i < 18; i += 1) {
      const width = 34 + (i * 17) % 55;
      const height = 70 + (i * 41) % 110;
      const x = i * 61 - 30;
      ctx.fillRect(x, 337 - height, width, height);
      ctx.fillStyle = i % 3 === 0 ? "#ffd44755" : "#42d9dc33";
      for (let row = 0; row < 3; row += 1) ctx.fillRect(x + 9, 247 - row * 25, 7, 5);
      ctx.fillStyle = "#0d1630";
    }
    ctx.fillStyle = stage === "market" ? "#1a1125" : "#11152b";
    ctx.fillRect(0, 345, W, 95);
    for (let i = 0; i < 19; i += 1) {
      const x = 20 + i * 54;
      ctx.fillStyle = i % 2 ? "#ff4f9a" : "#42d9dc";
      ctx.globalAlpha = .28;
      ctx.beginPath(); ctx.arc(x, 367 + Math.sin(time * 2 + i) * 3, 10 + (i % 3) * 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "#17152b"; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.strokeStyle = "#42d9dc22"; ctx.lineWidth = 2;
    for (let i = -12; i < 20; i += 1) { ctx.beginPath(); ctx.moveTo(W / 2, GROUND); ctx.lineTo(i * 100 + W / 2, H); ctx.stroke(); }
    ctx.strokeStyle = "#ffd44744"; ctx.beginPath(); ctx.moveTo(0, GROUND + 4); ctx.lineTo(W, GROUND + 4); ctx.stroke();
    if (stage === "market") {
      ctx.fillStyle = "#ffd447"; ctx.font = "900 13px Trebuchet MS"; ctx.fillText("NIGHT MARKET // KEEP IT LOUD", 28, 323);
      ctx.fillStyle = "#ff4f9a"; ctx.fillRect(720, 276, 160, 42); ctx.fillStyle = "#20122c"; ctx.fillText("OPEN TILL KO", 748, 302);
    } else {
      ctx.fillStyle = "#42d9dc"; ctx.font = "900 13px Trebuchet MS"; ctx.fillText("ROOFTOP 99 // NO REFUNDS", 28, 323);
      ctx.fillStyle = "#ffd447"; ctx.fillRect(745, 275, 128, 43); ctx.fillStyle = "#11152b"; ctx.fillText("RUMBLE", 778, 302);
    }
  }

  function drawMenuCanvas(time) {
    drawBackdrop(time, settings.stage);
    ctx.fillStyle = "#0d1338aa"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 12; i += 1) {
      ctx.strokeStyle = i % 2 ? "#ff4f9a33" : "#42d9dc33";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40 + i * 90, 0); ctx.lineTo(180 + i * 90, H); ctx.stroke();
    }
  }

  function drawFighter(f, time) {
    const crouch = f.crouching ? 18 : 0;
    const bob = f.grounded && !f.attack ? Math.sin(f.anim) * 2.2 : 0;
    const flash = f.hurtFlash > 0 && Math.floor(f.hurtFlash * 24) % 2 === 0;
    ctx.save();
    ctx.globalAlpha = .32;
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.ellipse(f.x, GROUND + 5, f.crouching ? 42 : 34, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(f.x, f.y + bob);
    ctx.scale(f.facing, 1);
    const body = flash ? "#ffffff" : f.color;
    const dark = flash ? "#ffffff" : f.dark;
    const accent = flash ? "#ffffff" : f.accent;
    const attack = f.attack;
    const supering = attack === "super";
    if (supering) { ctx.globalAlpha = .24; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(0, -104, 85 + Math.sin(time * 20) * 9, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.strokeStyle = "#070b1a"; ctx.lineWidth = 12; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-15, -55 + crouch); ctx.lineTo(-20, -5); ctx.moveTo(15, -55 + crouch); ctx.lineTo(22, -5); ctx.stroke();
    ctx.strokeStyle = accent; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-20, -5); ctx.lineTo(-31, 0); ctx.moveTo(22, -5); ctx.lineTo(35, 0); ctx.stroke();
    ctx.fillStyle = dark; roundedRect(ctx, -29, -125 + crouch, 58, 78, 17); ctx.fill();
    ctx.fillStyle = body; roundedRect(ctx, -24, -121 + crouch, 48, 69, 14); ctx.fill();
    ctx.fillStyle = accent; roundedRect(ctx, -23, -113 + crouch, 46, 12, 5); ctx.fill();
    ctx.strokeStyle = "#070b1a"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-23, -104 + crouch); ctx.lineTo(-50, -74 + crouch); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22, -104 + crouch); ctx.lineTo(51, -77 + crouch); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 6;
    if (attack === "punch" || attack === "grab" || supering) {
      ctx.beginPath(); ctx.moveTo(20, -103 + crouch); ctx.lineTo(supering ? 106 : 79, -112 + crouch); ctx.stroke();
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(supering ? 108 : 81, -112 + crouch, supering ? 14 : 9, 0, Math.PI * 2); ctx.fill();
    } else if (attack === "kick") {
      ctx.beginPath(); ctx.moveTo(15, -54 + crouch); ctx.lineTo(78, -40 + crouch); ctx.stroke();
      ctx.fillStyle = accent; roundedRect(ctx, 71, -48 + crouch, 31, 13, 5); ctx.fill();
    }
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(0, -151 + crouch, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(0, -153 + crouch, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = accent; roundedRect(ctx, -24, -161 + crouch, 48, 12, 5); ctx.fill();
    ctx.fillStyle = "#071021"; roundedRect(ctx, 1, -154 + crouch, 18, 7, 3); ctx.fill();
    ctx.fillStyle = accent; ctx.font = "900 9px Trebuchet MS"; ctx.textAlign = "center"; ctx.fillText(f.name.split(" ")[0], 0, -78 + crouch);
    if (f.blocking) { ctx.strokeStyle = "#dff8ff"; ctx.lineWidth = 4; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(31, -91 + crouch, 34, -1.1, 1.1); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.restore();
  }

  function drawEffects() {
    game.effects.forEach((effect) => {
      const alpha = clamp(effect.life / effect.max, 0, 1);
      ctx.save(); ctx.globalAlpha = alpha;
      if (effect.type === "impact") {
        const size = (1 - alpha) * 42 * effect.scale;
        ctx.strokeStyle = effect.color; ctx.lineWidth = 5;
        for (let i = 0; i < 8; i += 1) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(effect.x + Math.cos(a) * 8, effect.y + Math.sin(a) * 8); ctx.lineTo(effect.x + Math.cos(a) * (size + 20), effect.y + Math.sin(a) * (size + 20)); ctx.stroke(); }
      } else if (effect.type === "wave") {
        ctx.fillStyle = effect.color; ctx.shadowColor = effect.color; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(effect.x, effect.y, 28 + (1 - alpha) * 62, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(effect.x, effect.y, 8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawFight(time) {
    drawBackdrop(time, settings.stage);
    const shakeX = game ? (Math.random() - .5) * game.shake : 0;
    const shakeY = game ? (Math.random() - .5) * game.shake : 0;
    ctx.save(); ctx.translate(shakeX, shakeY);
    if (game && game.intro > 0) {
      ctx.fillStyle = "#0a1027aa"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffd447"; ctx.font = "900 54px Trebuchet MS"; ctx.textAlign = "center";
      ctx.fillText(game.intro > .7 ? "READY?" : "FIGHT!", W / 2, 250);
    }
    if (player && cpu) { drawFighter(player, time); drawFighter(cpu, time); }
    if (game) drawEffects();
    ctx.restore();
  }

  function render(time) {
    ctx.clearRect(0, 0, W, H);
    if (screen === "fight" || screen === "result" && game) drawFight(time);
    else drawMenuCanvas(time);
    if (screen === "title") {
      ctx.fillStyle = "#ffd447"; ctx.globalAlpha = .12; ctx.font = "900 118px Trebuchet MS"; ctx.fillText("RR", 50, 150); ctx.globalAlpha = 1;
    }
  }

  function gameLoop(now) {
    const dt = Math.min(.034, (now - lastFrame) / 1000);
    lastFrame = now;
    updateFight(dt);
    render(now / 1000);
    justPressed.clear();
    requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (screen !== "fight" || !game || game.phase !== "fight") return;
    game.paused = !game.paused;
    ui.pause.classList.toggle("hidden", !game.paused);
    if (game.paused) playTone(170, 0.05, "square");
  }

  function normalizeKey(key) { return key.length === 1 ? key.toLowerCase() : key; }

  window.addEventListener("keydown", (event) => {
    const key = normalizeKey(event.key);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) event.preventDefault();
    if (key === "Escape") { togglePause(); return; }
    if (key === "m") { soundOn = !soundOn; ui.sound.textContent = soundOn ? "SOUND ON" : "SOUND OFF"; return; }
    if (screen === "title" && key === "Enter") { startSelect(); return; }
    if (screen === "select" && key === "Enter") { startFight(); return; }
    if (screen === "result" && key === "Enter") { createGame(); return; }
    if (!keys.has(key)) justPressed.add(key);
    keys.add(key);
  });
  window.addEventListener("keyup", (event) => keys.delete(normalizeKey(event.key)));

  document.getElementById("startButton").addEventListener("click", startSelect);
  document.getElementById("backToTitle").addEventListener("click", () => setScreen("title"));
  document.getElementById("fightButton").addEventListener("click", startFight);
  document.getElementById("rematchButton").addEventListener("click", createGame);
  document.getElementById("selectAgainButton").addEventListener("click", () => setScreen("select"));
  document.getElementById("resumeButton").addEventListener("click", togglePause);
  document.getElementById("quitButton").addEventListener("click", () => { if (game) game.phase = "quit"; setScreen("select"); });
  ui.sound.addEventListener("click", () => { soundOn = !soundOn; ui.sound.textContent = soundOn ? "SOUND ON" : "SOUND OFF"; });

  document.querySelectorAll(".fighter-card").forEach((card) => card.addEventListener("click", () => {
    document.querySelectorAll(".fighter-card").forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    settings.playerFighter = card.dataset.fighter;
    settings.cpuFighter = settings.playerFighter === "neon" ? "road" : "neon";
    ui.cpuPreviewName.textContent = fighterData[settings.cpuFighter].name;
  }));
  document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-stage]").forEach((item) => item.classList.remove("active")); button.classList.add("active"); settings.stage = button.dataset.stage;
  }));
  document.querySelectorAll("[data-difficulty]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-difficulty]").forEach((item) => item.classList.remove("active")); button.classList.add("active"); settings.difficulty = button.dataset.difficulty;
  }));

  document.querySelectorAll("[data-key]").forEach((button) => {
    const key = button.dataset.key;
    const press = (event) => { event.preventDefault(); keys.add(key); };
    const release = (event) => { event.preventDefault(); keys.delete(key); };
    button.addEventListener("pointerdown", press); button.addEventListener("pointerup", release); button.addEventListener("pointercancel", release); button.addEventListener("pointerleave", release);
  });
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (screen !== "fight" || !game || game.paused || game.intro > 0) return;
    const action = button.dataset.action;
    player.perform(action);
  }));

  function playTone(frequency, duration, type) {
    if (!soundOn) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type || "sine"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.045, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch (_) { /* Audio is optional. */ }
  }

  setScreen("title");
  requestAnimationFrame(gameLoop);
})();
