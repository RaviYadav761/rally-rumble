import * as THREE from "./public/vendor/three.module.js";

(() => {
  "use strict";

  const W = 960, H = 540, GROUND = 430;
  const canvas = document.getElementById("fight3dCanvas");
  const gameWrap = document.querySelector(".game-wrap");
  const preview = document.querySelector(".select-preview");
  const geometryCache = new Map();
  const materialCache = new Map();
  const rigs = new Map();
  let renderer;
  let scene;
  let camera;
  let previousTime = performance.now();
  let selection = null;
  let enabled = false;
  const tempVector = new THREE.Vector3();

  const colorValue = (hex) => new THREE.Color(hex || "#d6aa83");
  const cachedGeometry = (key, make) => {
    if (!geometryCache.has(key)) geometryCache.set(key, make());
    return geometryCache.get(key);
  };
  const cachedMaterial = (hex, roughness = .74, options = {}) => {
    const key = `${hex}|${roughness}|${options.metalness || 0}|${options.emissive || ""}`;
    if (!materialCache.has(key)) materialCache.set(key, new THREE.MeshStandardMaterial({
      color: colorValue(hex), roughness, metalness: options.metalness || 0,
      emissive: options.emissive || "#000000", emissiveIntensity: options.emissiveIntensity || 0
    }));
    return materialCache.get(key);
  };
  const geometry = {
    sphere: (r = 1, detail = 12) => cachedGeometry(`s${r}-${detail}`, () => new THREE.SphereGeometry(r, detail, Math.max(8, detail - 2))),
    capsule: (r, length, radial = 10) => cachedGeometry(`c${r}-${length}-${radial}`, () => new THREE.CapsuleGeometry(r, length, 4, radial)),
    box: (x, y, z) => cachedGeometry(`b${x}-${y}-${z}`, () => new THREE.BoxGeometry(x, y, z)),
    cylinder: (top, bottom, h, radial = 12) => cachedGeometry(`y${top}-${bottom}-${h}-${radial}`, () => new THREE.CylinderGeometry(top, bottom, h, radial)),
    torus: (r, tube, radial = 8, tubular = 20) => cachedGeometry(`t${r}-${tube}-${radial}-${tubular}`, () => new THREE.TorusGeometry(r, tube, radial, tubular))
  };

  function makePart(parent, kind, dims, color, position = [0, 0, 0], options = {}) {
    const geo = kind === "capsule" ? geometry.capsule(dims[0], dims[1], dims[2] || 10)
      : kind === "sphere" ? geometry.sphere(dims[0], dims[1] || 12)
        : kind === "box" ? geometry.box(dims[0], dims[1], dims[2])
          : kind === "cylinder" ? geometry.cylinder(dims[0], dims[1], dims[2], dims[3] || 12)
            : kind === "torus" ? geometry.torus(dims[0], dims[1], dims[2] || 8, dims[3] || 20) : null;
    const material = options.flat ? new THREE.MeshBasicMaterial({ color: colorValue(color), side: THREE.DoubleSide }) : cachedMaterial(color, options.roughness || .74, options);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(position[0], position[1], position[2]);
    if (options.scale) mesh.scale.set(options.scale[0], options.scale[1], options.scale[2]);
    if (options.rotation) mesh.rotation.set(options.rotation[0], options.rotation[1], options.rotation[2]);
    mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = true;
    parent.add(mesh);
    return mesh;
  }

  function addArm(root, side, data, forward) {
    const shoulder = new THREE.Group(); shoulder.position.set(side * 26, 72, 0); root.add(shoulder);
    makePart(shoulder, "sphere", [12.5, 12], data.color, [0, 0, 0]);
    makePart(shoulder, "capsule", [10, 25], data.color, [0, -18, 0]);
    const elbow = new THREE.Group(); elbow.position.set(0, -35, 0); shoulder.add(elbow);
    makePart(elbow, "sphere", [8.7, 10], data.skin, [0, 0, 0]);
    makePart(elbow, "capsule", [8.6, 20], data.skin, [0, -14, 0]);
    const cuff = makePart(elbow, "torus", [7.5, 1.5, 8, 14], data.accent, [0, -28.5, 0], { rotation: [Math.PI / 2, 0, 0] });
    const fist = new THREE.Group(); fist.position.set(0, -32, 1); elbow.add(fist);
    makePart(fist, "sphere", [7.6, 10], data.skin, [0, 0, 0], { scale: [1, .78, .83] });
    for (const fingerSide of [-1, 0, 1]) {
      const finger = makePart(fist, "capsule", [1.65, 4.2, 8], data.skin, [fingerSide * 3.35, -4.1, 2.5]);
      finger.rotation.z = fingerSide * -.12;
    }
    const thumb = makePart(fist, "capsule", [2, 4.8, 8], data.skin, [-6, -.5, 3]); thumb.rotation.z = -.85;
    if (forward) makePart(fist, "box", [5, 1.7, 1.4], data.accent, [0, 1, 7.3]);
    return { shoulder, elbow, fist, cuff, side, forward };
  }

  function addLeg(root, side, data, forward) {
    const hip = new THREE.Group(); hip.position.set(side * 13, 72, 0); root.add(hip);
    makePart(hip, "sphere", [13, 10], data.dark, [0, 0, 0]);
    makePart(hip, "capsule", [11.8, 23], data.dark, [0, -19, 0]);
    const knee = new THREE.Group(); knee.position.set(0, -36, 0); hip.add(knee);
    makePart(knee, "sphere", [8.5, 10], data.dark, [0, 0, 0]);
    makePart(knee, "capsule", [9.2, 24], data.dark, [0, -15, 0]);
    const boot = makePart(knee, "capsule", [6.2, 11.5, 10], data.accent, [forward ? 5 : 1, -29, 5], { rotation: [0, 0, Math.PI / 2] });
    boot.scale.z = .85;
    makePart(knee, "capsule", [7, 1.2, 8], "#272a33", [forward ? 5 : 1, -34.2, 5], { rotation: [0, 0, Math.PI / 2] });
    return { hip, knee, forward };
  }

  function addHair(head, data, id) {
    const hair = data.hair || "#302720";
    makePart(head, "sphere", [19.2, 14], hair, [0, 9.5, -.8], { scale: [1.02, .66, .96] });
    if (id === "dozer") {
      makePart(head, "sphere", [22, 14], "#ed8a20", [0, 16, 0], { scale: [1, .48, 1] });
      makePart(head, "box", [44, 4, 25], "#e8a12c", [0, 10, 1]);
      makePart(head, "box", [9, 4, 25], "#f6d34d", [0, 19.2, .5]);
    } else if (id === "tollman" || id === "railraja") {
      const cap = id === "tollman" ? "#2374b5" : "#263247";
      makePart(head, "sphere", [22, 14], cap, [0, 14, 0], { scale: [1, .42, .98] });
      makePart(head, "box", [42, 4, 23], cap, [0, 9, 4]);
      makePart(head, "box", [24, 2.5, 2], "#f1c75d", [0, 15, 11]);
    } else if (id === "suttibabu" || id === "mbapu") {
      makePart(head, "sphere", [19, 14], hair, [0, 9, 0], { scale: [1, .38, .96] });
    }
    if (id === "deedee") {
      makePart(head, "sphere", [8, 9], hair, [-16, 2, -5]);
      makePart(head, "sphere", [5, 6], hair, [-20, 1, -2]);
    }
  }

  function addFace(head, data, id) {
    const skin = data.skin || "#bf876d";
    makePart(head, "sphere", [18, 18], skin, [0, 0, 0], { scale: [1, 1.12, .93] });
    makePart(head, "sphere", [4.2, 10], skin, [-18, -1, 0]);
    makePart(head, "sphere", [4.2, 10], skin, [18, -1, 0]);
    for (const x of [-6.4, 6.4]) {
      makePart(head, "sphere", [2.7, 10], "#f9eddc", [x, 2.2, 15.5], { scale: [1, .78, .45] });
      makePart(head, "sphere", [1.25, 8], "#24232c", [x, 2.2, 16.65], { scale: [1, 1, .55] });
      makePart(head, "box", [5.8, 1.4, 2.4], data.hair || "#302720", [x, 6.6, 15.8]);
    }
    makePart(head, "sphere", [2.2, 8], skin, [0, -2.7, 17.2]);
    makePart(head, "box", [7.4, 1.5, 1.5], id === "factbhai" ? "#714b40" : "#70473d", [0, -9.6, 16.9]);
    if (id === "mbapu" || id === "suttibabu" || id === "mitraman") {
      for (const x of [-6.3, 6.3]) {
        const lens = makePart(head, "torus", [4.8, .85], "#d6bd7b", [x, 2, 16.3]);
        lens.rotation.z = 0;
      }
      makePart(head, "box", [3, 1.4, 1], "#d6bd7b", [0, 2, 16.8]);
    }
    if (id === "deedee") {
      for (const x of [-18, 18]) makePart(head, "torus", [2.5, .65], data.accent, [x, -8, 3], { rotation: [Math.PI / 2, 0, 0] });
    }
    if (id === "dozer" || id === "mitraman" || id === "mbapu") {
      const facialHair = data.id === "mitraman" || id === "mbapu" ? (data.hair || "#e8e4da") : (data.hair || "#44352f");
      makePart(head, "sphere", [8.5, 10], facialHair, [0, -8.2, 15.7], { scale: [1, .36, .45] });
      if (id !== "dozer") makePart(head, "sphere", [10.5, 10], facialHair, [0, -15, 7], { scale: [1, .72, .56] });
    }
    if (id === "mbapu") {
      makePart(head, "sphere", [13, 10], data.hair, [0, -14, 4], { scale: [1, .72, .65] });
    }
    addHair(head, data, id);
  }

  function decorate(avatar, data) {
    const id = data.id;
    const accent = data.accent || "#e7c46d";
    const dark = data.dark || "#28313d";
    const bodyPivot = avatar.bodyPivot;
    // Raised collar and waist sash make the torso readable in the side-view camera.
    makePart(bodyPivot, "capsule", [7, 11, 10], dark, [0, 78, 0], { scale: [3, .7, 1.8] });
    const belt = makePart(bodyPivot, "torus", [26, 2.2, 8, 24], accent, [0, 13, 0], { rotation: [Math.PI / 2, 0, 0] });
    belt.scale.set(1, 1, .84);
    const sash = makePart(bodyPivot, "capsule", [5.2, 42, 10], id === "tariff" ? "#bd6f36" : "#e8dfc7", [0, 48, 23], { scale: [1.1, 1, .2], rotation: [0, 0, -.13] });
    makePart(bodyPivot, "sphere", [3.1, 9], accent, [0, 62, 23]);
    makePart(bodyPivot, "sphere", [2.6, 9], accent, [0, 46, 23]);
    if (id === "yatra" || id === "mitraman" || id === "deedee") {
      const scarf = makePart(bodyPivot, "capsule", [6.5, 56], id === "deedee" ? "#479fc5" : accent, [id === "deedee" ? -13 : 13, 50, 23]);
      scarf.rotation.z = id === "deedee" ? -.35 : .3;
    }
    if (id === "gharmantri") {
      makePart(avatar.root, "box", [48, 116, 5], "#22333a", [-23, 112, -17]);
      const folioHand = avatar.arms.find((arm) => !arm.forward).fist;
      makePart(folioHand, "box", [18, 23, 5], "#be9c54", [-2, -3, 9]);
      makePart(folioHand, "box", [12, 1.2, 1], "#e7d7af", [-2, 2, 12]);
    }
    if (id === "factbhai") {
      makePart(bodyPivot, "box", [17, 23, 5], "#213d4a", [-17, 44, 24]);
      makePart(bodyPivot, "box", [11, 1.5, 2], "#79e2d8", [-17, 49, 27]);
      makePart(bodyPivot, "box", [9, 1.5, 2], "#79e2d8", [-17, 44, 27]);
      const magnifierHand = avatar.arms.find((arm) => arm.forward).fist;
      const lens = makePart(magnifierHand, "torus", [5.5, 1.7], "#eed06b", [2, 2, 8]);
      lens.rotation.x = .25;
      makePart(magnifierHand, "cylinder", [1, 1, 11], "#eed06b", [6, -4, 8], { rotation: [0, 0, -.65] });
    }
    if (id === "tollman") {
      makePart(bodyPivot, "torus", [5, 1.5], "#ffe072", [-16, 65, 25]);
      makePart(bodyPivot, "box", [12, 17, 4], "#eef4ed", [15, 44, 23]);
    }
    if (id === "railraja") {
      makePart(bodyPivot, "box", [18, 20, 4], "#d34b4c", [-17, 44, 23]);
      makePart(bodyPivot, "box", [10, 2, 2], "#fff0cf", [-17, 48, 26]);
      const ticketHand = avatar.arms.find((arm) => arm.forward).fist;
      makePart(ticketHand, "box", [11, 8, 10], "#bc9450", [0, -1, 10]);
      makePart(ticketHand, "box", [5, 2, 2], "#f5d67f", [0, 1, 16]);
    }
    if (id === "dozer") {
      makePart(bodyPivot, "box", [16, 14, 4], "#ecad32", [-16, 62, 22]);
    }
    if (id === "mbapu" || id === "suttibabu") {
      const drape = makePart(bodyPivot, "box", [11, 74, 5], id === "mbapu" ? "#f7eddd" : "#b7b3a8", [-19, 40, 22]);
      drape.rotation.z = -.15;
    }
    if (id === "mbapu") {
      const staffHand = avatar.arms.find((arm) => !arm.forward).fist;
      makePart(staffHand, "cylinder", [2.6, 2.2, 174, 10], "#8c5a34", [0, 28, -7]);
      makePart(staffHand, "cylinder", [3.7, 3, 10, 10], "#d6bb79", [0, 112, -7]);
      makePart(staffHand, "cylinder", [3.7, 3, 8, 10], "#d6bb79", [0, -57, -7]);
    }
    if (id === "tollman") {
      const batonHand = avatar.arms.find((arm) => !arm.forward).fist;
      makePart(batonHand, "capsule", [3, 16, 8], "#1a3454", [0, 11, -4]);
      makePart(batonHand, "torus", [3.1, .8, 6, 12], "#f0cb68", [0, 22, -4], { rotation: [Math.PI / 2, 0, 0] });
    }
  }

  function buildRig(data) {
    const root = new THREE.Group();
    const shadow = makePart(root, "sphere", [28, 20], "#080b12", [0, 1, -5], { scale: [1, .04, .57], flat: true });
    shadow.material.transparent = true; shadow.material.opacity = .28; shadow.renderOrder = -1;
    const pelvis = new THREE.Group(); pelvis.position.set(0, 72, 0); root.add(pelvis);
    makePart(pelvis, "capsule", [16, 14], data.dark, [0, -1, 0]);
    const leftLeg = addLeg(root, -1, data, false), rightLeg = addLeg(root, 1, data, true);
    const bodyPivot = new THREE.Group(); bodyPivot.position.set(0, 77, 0); root.add(bodyPivot);
    makePart(bodyPivot, "cylinder", [22, 30, 66, 14], data.color, [0, 43, 0]);
    makePart(bodyPivot, "capsule", [18, 28], data.color, [0, 75, 0]);
    makePart(bodyPivot, "capsule", [23, 5, 8], data.dark, [0, 8, 0], { scale: [1, .75, .84] });
    const leftArm = addArm(bodyPivot, -1, data, false), rightArm = addArm(bodyPivot, 1, data, true);
    const neck = makePart(bodyPivot, "cylinder", [7.4, 8.2, 16], data.skin, [0, 91, 0]);
    const head = new THREE.Group(); head.position.set(0, 109, 0); bodyPivot.add(head);
    addFace(head, data, data.id);
    decorate({ root, bodyPivot, arms: [leftArm, rightArm] }, data);
    return { id: data.id, data, root, head, bodyPivot, pelvis, arms: [leftArm, rightArm], legs: [leftLeg, rightLeg], neck, shadow, fall: 0, win: 0, depthOffset: 0, poseState: {}, meshCount: countMeshes(root) };
  }
  function countMeshes(root) {
    let total = 0; root.traverse((obj) => { if (obj.isMesh) total += 1; }); return total;
  }
  function getRig(f) {
    let rig = rigs.get(f.id);
    if (!rig) { rig = buildRig(f); rigs.set(f.id, rig); scene.add(rig.root); }
    return rig;
  }
  function smooth(a, b, value) {
    const x = THREE.MathUtils.clamp((value - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  }
  function easeProgress(progress) {
    const x = THREE.MathUtils.clamp(progress, 0, 1);
    return x * x * (3 - 2 * x);
  }

  function applyPose(rig, f, time, dt, mode) {
    const data = rig.data;
    const moving = f.grounded && !f.attack && !f.crouching ? THREE.MathUtils.clamp(Math.abs(f.vx || 0) / (f.speed || 285), 0, 1) : 0;
    const phase = f.step || time * 2.5;
    const idlePulse = f.grounded && !f.attack && !f.crouching ? Math.sin(time * 2.15 + (f.isPlayer ? .4 : 1.7)) * .035 : 0;
    const jump = f.grounded ? 0 : THREE.MathUtils.clamp((GROUND - f.y) / 105, 0, 1);
    const attackProgress = f.attack && f.currentAttackSpec ? THREE.MathUtils.clamp(1 - f.attackTimer / f.currentAttackSpec.duration, 0, 1) : 0;
    const extension = f.attack ? (smooth(.15, .42, attackProgress) * (1 - smooth(.58, .83, attackProgress))) : 0;
    const breathing = Math.sin(time * 2.9 + (f.isPlayer ? .4 : 1.7));
    const body = rig.bodyPivot;
    const crouch = f.crouching ? 14 : 0;
    body.position.y = 77 - crouch + breathing * .8;
    rig.pelvis.position.y = 72 - crouch * .42;
    rig.head.rotation.z = Math.sin(time * 2.2 + (f.isPlayer ? 0 : 1.4)) * .035 + moving * Math.sin(phase) * .045 - Math.min(.16, f.hitstun * .16);
    rig.head.rotation.y = (f.facing > 0 ? .025 : -.025) + Math.sin(time * 1.5 + (f.isPlayer ? 0 : 1)) * .025;
    const bodyLean = f.hitstun > 0 ? -.3 * Math.min(1, f.hitstun * 3) : f.attack === "punch" ? .09 * extension : f.attack === "kick" ? -.08 * extension : idlePulse * .3;
    body.rotation.z = bodyLean + Math.sin(phase) * moving * .045;
    body.rotation.y = Math.sin(phase + .5) * moving * .07;
    const gait = moving * Math.sin(phase);
    rig.legs.forEach((leg, index) => {
      const cycle = Math.sin(phase + (index === 0 ? Math.PI : 0));
      leg.hip.rotation.z = cycle * .58 * moving + (index === 0 ? 1 : -1) * idlePulse * .45;
      leg.knee.rotation.z = Math.max(0, cycle) * .72 * moving + Math.abs(idlePulse) * .13;
      if (jump > .05) {
        leg.hip.rotation.z = (leg.forward ? .28 : -.24) + Math.abs(gait) * .20;
        leg.knee.rotation.z = .78 + jump * .35;
      }
      if (f.crouching) { leg.hip.rotation.z = (leg.forward ? .08 : -.08); leg.knee.rotation.z = .70; }
      if (f.attack === "kick" && leg.forward) {
        leg.hip.rotation.z = THREE.MathUtils.lerp(leg.hip.rotation.z, 1.34 * extension, easeProgress(attackProgress));
        leg.knee.rotation.z = THREE.MathUtils.lerp(leg.knee.rotation.z, -.2 * extension, easeProgress(attackProgress));
      }
    });
    const guarding = !!f.blocking;
    const attacking = !!f.attack;
    rig.arms.forEach((arm) => {
      const front = arm.forward;
      const idleSwing = (front ? -1 : 1) * gait * .32;
      let shoulderAngle = (front ? 1.34 : 1.12) + idleSwing + idlePulse * (front ? 1.25 : -1.1) - jump * .16;
      let elbowAngle = (front ? 1.34 : 1.58) + moving * .10 + idlePulse * (front ? .65 : -.55);
      if (guarding) { shoulderAngle = front ? 1.42 : 1.20; elbowAngle = front ? 1.34 : 1.58; }
      if (f.hitstun > 0) { shoulderAngle = front ? .78 : 2.55; elbowAngle = front ? -.42 : -1.75; }
      if (f.crouching && !attacking) { shoulderAngle = front ? 1.22 : 1.07; elbowAngle = front ? 1.74 : 1.88; }
      if (f.attack === "punch" && front) { shoulderAngle = THREE.MathUtils.lerp(2.0, 1.56, extension); elbowAngle = THREE.MathUtils.lerp(-1.12, .02, extension); }
      if (f.attack === "kick") { shoulderAngle = front ? 1.38 : 1.12; elbowAngle = front ? 1.34 : 1.58; }
      if (f.attack === "grab") { shoulderAngle = front ? 1.72 : 1.9; elbowAngle = front ? -.68 : -.78; }
      if (f.attack === "super") { shoulderAngle = front ? 2.78 - extension * .22 : 2.52; elbowAngle = front ? -.1 : -.18; }
      if (!attacking && jump > .05) { shoulderAngle = front ? 2.58 : 2.34; elbowAngle = front ? -.2 : -.42; }
      arm.shoulder.rotation.z = shoulderAngle;
      arm.elbow.rotation.z = elbowAngle;
    });
    rig.fall = THREE.MathUtils.damp(rig.fall, f.health <= 0 || f.roundLoser ? 1 : 0, 5.5, dt);
    const winner = mode === "round-end" && !!f.roundWinner;
    rig.win = THREE.MathUtils.damp(rig.win, winner ? 1 : 0, 4.5, dt);
    body.rotation.z = bodyLean + Math.sin(phase) * moving * .045 - rig.win * .08;
    rig.root.rotation.set(0, .56, (f.facing > 0 ? -1 : 1) * rig.fall * 1.32);
    rig.root.position.set(f.x, H - f.y - rig.fall * 27, f.isPlayer ? 2 : 0);
    rig.root.scale.set((f.facing > 0 ? 1 : -1) * (mode === "select" ? .82 : 1), mode === "select" ? .82 : 1, mode === "select" ? .82 : 1);
    rig.root.position.y += rig.win * (5 + Math.sin(time * 8) * 5);
    rig.arms.forEach((arm) => {
      if (rig.win > .02) {
        const lift = 2.68 * rig.win;
        arm.shoulder.rotation.z = THREE.MathUtils.lerp(arm.shoulder.rotation.z, lift + (arm.forward ? -.08 : .08), rig.win);
        arm.elbow.rotation.z = THREE.MathUtils.lerp(arm.elbow.rotation.z, -.12, rig.win);
      }
    });
    rig.legs.forEach((leg) => {
      if (rig.win > .02) { leg.hip.rotation.z = THREE.MathUtils.lerp(leg.hip.rotation.z, leg.forward ? .08 : -.08, rig.win); leg.knee.rotation.z = THREE.MathUtils.lerp(leg.knee.rotation.z, .08, rig.win); }
      if (rig.fall > .05) {
        leg.hip.rotation.z = THREE.MathUtils.lerp(leg.hip.rotation.z, leg.forward ? .48 : -.62, rig.fall);
        leg.knee.rotation.z = THREE.MathUtils.lerp(leg.knee.rotation.z, .42, rig.fall);
      }
    });
    rig.arms.forEach((arm) => {
      if (rig.fall > .05) {
        arm.shoulder.rotation.z = THREE.MathUtils.lerp(arm.shoulder.rotation.z, arm.forward ? 1.0 : 2.65, rig.fall);
        arm.elbow.rotation.z = THREE.MathUtils.lerp(arm.elbow.rotation.z, arm.forward ? -.3 : -1.0, rig.fall);
      }
    });
  }

  function pixelWorld(clientX, clientY, rect) {
    return [(clientX - rect.left) / rect.width * W, H - (clientY - rect.top) / rect.height * H];
  }
  function setRigPixelPosition(rig, x, y, direction, scale, time, dt, mode) {
    const pose = rig.poseState;
    pose.id = rig.id; pose.x = x; pose.y = GROUND; pose.vx = Math.sin(time * 2.2) * 2; pose.vy = 0;
    pose.facing = direction; pose.grounded = true; pose.attack = null; pose.attackTimer = 0; pose.currentAttackSpec = null;
    pose.blocking = false; pose.crouching = false; pose.hitstun = 0; pose.health = 100; pose.step = time * 2.7;
    pose.anim = time * 2.7; pose.speed = 285; pose.isPlayer = direction > 0; pose.roundWinner = false; pose.roundLoser = false;
    applyPose(rig, pose, time, dt, mode);
    rig.root.position.set(x, H - y, 0);
    rig.root.scale.set(direction > 0 ? scale : -scale, scale, scale);
  }

  function renderSelection(time, dt) {
    const data = selection;
    if (!data || !preview) { rigs.forEach((r) => { r.root.visible = false; }); return; }
    const wrapRect = gameWrap.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();
    const groundPixelY = previewRect.bottom - Math.max(22, previewRect.height * .07);
    const base = H - (groundPixelY - wrapRect.top) / wrapRect.height * H;
    const startX = (previewRect.left - wrapRect.left) / wrapRect.width * W;
    const width = previewRect.width / wrapRect.width * W;
    const p = getRig(data.player);
    const c = getRig(data.cpu);
    setRigPixelPosition(p, startX + width * .27, GROUND, 1, .83, time, dt, "select");
    setRigPixelPosition(c, startX + width * .73, GROUND, -1, .83, time + .75, dt, "select");
    p.root.position.y = base; c.root.position.y = base;
    p.root.visible = true; c.root.visible = true;
    rigs.forEach((r) => { if (r !== p && r !== c) r.root.visible = false; });
  }

  function placeFightRig(fighter, time, info, zoom, shakeX, shakeY) {
    const rig = getRig(fighter), state = rig.poseState;
    const px = W / 2 + (fighter.x - W / 2) * zoom + shakeX;
    const py = H / 2 + (fighter.y - H / 2) * zoom + shakeY;
    state.id = fighter.id; state.x = px; state.y = fighter.y; state.vx = fighter.vx; state.vy = fighter.vy;
    state.speed = fighter.speed; state.facing = fighter.facing; state.grounded = fighter.grounded;
    state.step = fighter.step; state.anim = fighter.anim; state.attack = fighter.attack;
    state.attackTimer = fighter.attackTimer; state.currentAttackSpec = fighter.currentAttackSpec;
    state.blocking = fighter.blocking; state.crouching = fighter.crouching; state.hitstun = fighter.hitstun;
    state.health = fighter.health; state.isPlayer = fighter.isPlayer;
    state.roundWinner = info.phase === "round-end" && (fighter.isPlayer ? info.winner === "PLAYER" : info.winner === "CPU" || info.winner === "P2");
    state.roundLoser = info.phase === "round-end" && !state.roundWinner;
    applyPose(rig, state, time, info.dt, info.phase === "round-end" ? "round-end" : "fight");
    rig.root.visible = !info.hidden;
    rig.root.position.x = px;
    rig.root.position.y = H - py - rig.fall * 27;
    rig.root.position.z = fighter.isPlayer ? 2 : 0;
    return rig;
  }
  function renderFight(player, cpu, time, info) {
    if (!player || !cpu) { rigs.forEach((r) => { r.root.visible = false; }); return; }
    const zoom = info.zoom || 1, sx = info.shakeX || 0, sy = info.shakeY || 0;
    const a = placeFightRig(player, time, info, zoom, sx, sy);
    const b = placeFightRig(cpu, time, info, zoom, sx, sy);
    rigs.forEach((r) => { if (r !== a && r !== b) r.root.visible = false; });
  }

  function resize() {
    const rect = gameWrap.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
    camera.left = 0; camera.right = W; camera.top = H; camera.bottom = 0;
    camera.updateProjectionMatrix();
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power", premultipliedAlpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(0, W, H, 0, .1, 2000);
    camera.position.set(0, 0, 1000); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xe6ecff, 0x51404a, 2.0));
    const key = new THREE.DirectionalLight(0xffe0a5, 2.25); key.position.set(-270, 410, 340); scene.add(key);
    const fill = new THREE.DirectionalLight(0x86bceb, 1.05); fill.position.set(290, 250, 230); scene.add(fill);
    const rim = new THREE.PointLight(0xffa94d, 92, 680, 2); rim.position.set(485, 320, 125); scene.add(rim);
    resize();
    const observer = new ResizeObserver(resize); observer.observe(gameWrap);
    window.addEventListener("resize", resize, { passive: true });
    enabled = true;
    document.body.classList.add("three-fighters-ready");
  } catch (error) {
    console.warn("Rally Rumble 3D renderer unavailable; using 2D fallback.", error);
    canvas.classList.add("hidden");
  }

  window.rallyThree = {
    get isReady() { return enabled; },
    setSelection(playerData, cpuData) {
      if (!enabled || !playerData || !cpuData) return;
      if (!selection || selection.player.id !== playerData.id || selection.cpu.id !== cpuData.id) {
        selection = { player: playerData, cpu: cpuData };
      }
    },
    renderSelection(time) {
      if (!enabled) return;
      const now = performance.now(), dt = Math.min(.05, Math.max(0, (now - previousTime) / 1000)); previousTime = now;
      canvas.style.zIndex = "5"; canvas.style.opacity = "1";
      renderSelection(time, dt); renderer.render(scene, camera);
    },
    renderFight(player, cpu, time, state) {
      if (!enabled) return;
      const now = performance.now(), dt = Math.min(.05, Math.max(0, (now - previousTime) / 1000)); previousTime = now;
      canvas.style.zIndex = "1"; canvas.style.opacity = state.intro > 0 ? ".4" : "1";
      state.dt = dt;
      renderFight(player, cpu, time, state); renderer.render(scene, camera);
    },
    hide() { if (enabled) canvas.style.opacity = "0"; },
    diagnostics() {
      const roster = [...rigs.values()].map((r) => ({
        id: r.id, visibleMeshes: r.meshCount, articulatedArms: r.arms.length, articulatedLegs: r.legs.length,
        armAngles: r.arms.map((a) => [Number(a.shoulder.rotation.z.toFixed(3)), Number(a.elbow.rotation.z.toFixed(3))]),
        legAngles: r.legs.map((l) => [Number(l.hip.rotation.z.toFixed(3)), Number(l.knee.rotation.z.toFixed(3))]),
        visible: r.root.visible, rootPosition: [Number(r.root.position.x.toFixed(1)), Number(r.root.position.y.toFixed(1)), Number(r.root.position.z.toFixed(1))], rootScale: [Number(r.root.scale.x.toFixed(2)), Number(r.root.scale.y.toFixed(2))]
      }));
      return { webgl: enabled, threeVersion: THREE.REVISION, fighterCount: roster.length, fighters: roster, maxPixelRatio: 1.2, maxViewportWidth: W, maxViewportHeight: H, renderCalls: enabled ? renderer.info.render.calls : 0, drawingBuffer: enabled ? [renderer.domElement.width, renderer.domElement.height] : [0, 0], camera: enabled ? [camera.left, camera.right, camera.top, camera.bottom] : [] };
    }
  };
})();
