/**
 * cooking_game.js - Full 3D MasterChef Playable Mobile Ad Game 
 * Built with Three.js for real-time 3D kitchen simulation, dynamic lighting,
 * procedural food textures, laser drop aiming guide, strict chef evaluation,
 * and hilarious Malayalam chef judging roasts ("Vere vella panikkum poikkoode?").
 */

// Universal roundRect polyfill to ensure compatibility across all browser engines
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
 CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
 if (!radii) radii = 0;
 if (typeof radii === 'number') {
 radii = { tl: radii, tr: radii, br: radii, bl: radii };
 } else if (Array.isArray(radii)) {
 radii = { tl: radii[0] || 0, tr: radii[1] || 0, br: radii[2] || 0, bl: radii[3] || 0 };
 }
 this.beginPath();
 this.moveTo(x + radii.tl, y);
 this.lineTo(x + w - radii.tr, y);
 this.quadraticCurveTo(x + w, y, x + w, y + radii.tr);
 this.lineTo(x + w, y + h - radii.br);
 this.quadraticCurveTo(x + w, y + h, x + w - radii.br, y + h);
 this.lineTo(x + radii.bl, y + h);
 this.quadraticCurveTo(x, y + h, x, y + h - radii.bl);
 this.lineTo(x, y + radii.tl);
 this.quadraticCurveTo(x, y, x + radii.tl, y);
 this.closePath();
 return this;
 };
}

// Procedural Canvas Texture Generator for realistic food surfaces
const FoodTextureFactory = {
 getTomatoSkinTexture: function() {
 const canvas = document.createElement('canvas');
 canvas.width = 256;
 canvas.height = 256;
 const ctx = canvas.getContext('2d');

 const grad = ctx.createRadialGradient(80, 80, 20, 128, 128, 130);
 grad.addColorStop(0, '#ff4d4d');
 grad.addColorStop(0.6, '#dc2626');
 grad.addColorStop(1, '#991b1b');
 ctx.fillStyle = grad;
 ctx.fillRect(0, 0, 256, 256);

 ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
 for (let i = 0; i < 70; i++) {
 ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
 }
 const tex = new THREE.CanvasTexture(canvas);
 tex.wrapS = THREE.RepeatWrapping;
 tex.wrapT = THREE.RepeatWrapping;
 return tex;
 },

 getTomatoSliceTexture: function() {
 const canvas = document.createElement('canvas');
 canvas.width = 256;
 canvas.height = 256;
 const ctx = canvas.getContext('2d');

 // Outer skin ring
 ctx.fillStyle = '#b91c1c';
 ctx.beginPath();
 ctx.arc(128, 128, 126, 0, Math.PI * 2);
 ctx.fill();

 // Inner fleshy flesh
 ctx.fillStyle = '#ef4444';
 ctx.beginPath();
 ctx.arc(128, 128, 114, 0, Math.PI * 2);
 ctx.fill();

 // Center Core
 ctx.fillStyle = '#f87171';
 ctx.beginPath();
 ctx.arc(128, 128, 30, 0, Math.PI * 2);
 ctx.fill();

 // 4 Seed jelly chambers
 for (let i = 0; i < 4; i++) {
 const angle = (i * Math.PI) / 2 + Math.PI / 4;
 const cx = 128 + Math.cos(angle) * 65;
 const cy = 128 + Math.sin(angle) * 65;
 ctx.fillStyle = '#7f1d1d';
 ctx.beginPath();
 ctx.ellipse(cx, cy, 32, 20, angle, 0, Math.PI * 2);
 ctx.fill();

 // Yellow seeds in jelly
 ctx.fillStyle = '#fde047';
 for (let s = -1; s <= 1; s++) {
 const sx = cx + Math.cos(angle + Math.PI / 2) * (s * 10);
 const sy = cy + Math.sin(angle + Math.PI / 2) * (s * 10);
 ctx.beginPath();
 ctx.ellipse(sx, sy, 5, 3, angle, 0, Math.PI * 2);
 ctx.fill();
 }
 }

 return new THREE.CanvasTexture(canvas);
 },

 getOnionTexture: function() {
 const canvas = document.createElement('canvas');
 canvas.width = 256;
 canvas.height = 256;
 const ctx = canvas.getContext('2d');

 ctx.fillStyle = '#7e22ce';
 ctx.fillRect(0, 0, 256, 256);

 ctx.strokeStyle = '#c084fc';
 ctx.lineWidth = 2;
 for (let x = 0; x < 256; x += 12) {
 ctx.beginPath();
 ctx.moveTo(x, 0);
 ctx.bezierCurveTo(x + 8, 80, x - 8, 180, x, 256);
 ctx.stroke();
 }

 ctx.strokeStyle = '#fae8ff';
 ctx.lineWidth = 1;
 for (let x = 6; x < 256; x += 12) {
 ctx.beginPath();
 ctx.moveTo(x, 0);
 ctx.bezierCurveTo(x - 5, 90, x + 5, 170, x, 256);
 ctx.stroke();
 }

 const tex = new THREE.CanvasTexture(canvas);
 tex.wrapS = THREE.RepeatWrapping;
 tex.wrapT = THREE.RepeatWrapping;
 return tex;
 },

 getPattyTexture: function() {
 const canvas = document.createElement('canvas');
 canvas.width = 256;
 canvas.height = 256;
 const ctx = canvas.getContext('2d');

 ctx.fillStyle = '#451a03';
 ctx.fillRect(0, 0, 256, 256);

 ctx.fillStyle = '#78350f';
 for (let i = 0; i < 350; i++) {
 ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
 }
 ctx.fillStyle = '#291104';
 for (let i = 0; i < 250; i++) {
 ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 2);
 }

 // Charred Grill Crosshatch Marks
 ctx.strokeStyle = '#140803';
 ctx.lineWidth = 11;
 ctx.lineCap = 'round';
 for (let x = 30; x < 256; x += 52) {
 ctx.beginPath();
 ctx.moveTo(x - 35, 20);
 ctx.lineTo(x + 35, 236);
 ctx.stroke();
 }
 for (let x = 30; x < 256; x += 52) {
 ctx.beginPath();
 ctx.moveTo(x + 35, 20);
 ctx.lineTo(x - 35, 236);
 ctx.stroke();
 }

 return new THREE.CanvasTexture(canvas);
 },

 getBunTopTexture: function() {
 const canvas = document.createElement('canvas');
 canvas.width = 256;
 canvas.height = 256;
 const ctx = canvas.getContext('2d');

 const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
 grad.addColorStop(0, '#fde68a');
 grad.addColorStop(0.65, '#d97706');
 grad.addColorStop(1, '#92400e');
 ctx.fillStyle = grad;
 ctx.fillRect(0, 0, 256, 256);

 // Scattered White/Cream Sesame Seeds
 ctx.fillStyle = '#fef3c7';
 ctx.strokeStyle = '#78350f';
 ctx.lineWidth = 0.5;
 for (let i = 0; i < 85; i++) {
 const angle = Math.random() * Math.PI * 2;
 const r = Math.random() * 105;
 const x = 128 + Math.cos(angle) * r;
 const y = 128 + Math.sin(angle) * r;
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(Math.random() * Math.PI);
 ctx.beginPath();
 ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.stroke();
 ctx.restore();
 }

 return new THREE.CanvasTexture(canvas);
 }
};

// Malayalam Roast & Praise Dialogue Database
const MALAYALAM_ROASTS = {
 raw: [
 {
 mal: "Vare vella panikkan poikkatte?!",
 trans: "Vere vella panikkum poikkoode?!",
 eng: "Can't you go do some other work?! A stone has more cooking talent than you!"
 },
 {
 mal: "Nee enth aale kollan nokkunnavo?!",
 trans: "Nee entha aale kollan nokkuvaano?!",
 eng: "Are you trying to murder someone?! The meat is still raw and crying for help!"
 },
 {
 mal: "Ithu manushyan thinnana saadhanamo? Kanda vazhi odikk!",
 trans: "Ithokke manushyan thinnunna saadhanamano? Kandam vazhi odikko!",
 eng: "Is this meant for human consumption? Run away through the paddy fields!"
 }
 ],
 burnt: [
 {
 mal: "Vare vella panikkan poikkatte?! Adukkale muzhuvan karinja naadam!",
 trans: "Vere vella panikkum poikkoode?! Adukkala muzhuvan karinja naattam!",
 eng: "Can't you do something else?! The entire kitchen smells like cremated charcoal!"
 },
 {
 mal: "Police case aavumo daivame! Ithu aahaaramalla, jeeva aayudhamanu!",
 trans: "Police case aavumo daivame! Ithu aahaaramalla, jaivaayudhamanu!",
 eng: "God save us, will this become a police case?! This isn't food, it's a bio-weapon!"
 },
 {
 mal: "Ithu kandu Chef Pillai polum bodhamkettu veenu!",
 trans: "Ithu kandu Chef Pillai polum bodhamkettu veenu!",
 eng: "Even legendary Chef Pillai fainted seeing this burnt disaster!"
 }
 ],
 toppled: [
 {
 mal: "Nee enth aale kollan nokkunnavo?! Burger nilathu veenu chath!",
 trans: "Nee entha aale kollan nokkuvaano?! Burger nilathu veenu chathu!",
 eng: "Are you trying to destroy everything?! The burger crashed flat onto the floor!"
 },
 {
 mal: "Vare vella panikkan poikkatte?! Oru burger nere vekkan arinjure?!",
 trans: "Vere vella panikkum poikkoode?! Oru burger nere vekkan arinjude?!",
 eng: "Can't you do something else?! You can't even stack a burger without it toppling?!"
 }
 ],
 crookedReject: [
 {
 mal: "Vare vella panikkan poikkatte?! Burger cherinju Leaning Tower of Pisa pole aayirikkunnu!",
 trans: "Vere vella panikkum poikkoode?! Burger cherinju Leaning Tower of Pisa pole aayirikkunnu!",
 eng: "Can't you do something else?! The burger is leaning like the Tower of Pisa! An absolute eyesore!"
 },
 {
 mal: "Nee enth aale kollan nokkunnavo?! Ee saadhanam kandu ente blood pressure 200 aayi!",
 trans: "Nee entha aale kollan nokkuvaano?! Ee saadhanam kandu ente blood pressure 200 aayi!",
 eng: "Are you trying to kill someone?! My blood pressure just hit 200 seeing this crooked disaster!"
 },
 {
 mal: "Ithu undaakkiyavane pidichu jailil idanam! Pattikal polum ithu thinnilla!",
 trans: "Ithundaakkiyavane pidichu jailil idanam! Pattikal polum ithu thinnilla!",
 eng: "Whoever made this should be locked up! Even stray dogs would run away from this!"
 }
 ],
 win: [
 {
 mal: "Ente Saare... Ithu vere level! Gordon Ramsay vare thottupoyi!",
 trans: "Ente Saare... Ithu vere level! Gordon Ramsay vare thottupoyi!",
 eng: "Sir, this is purely on another level! Even Gordon Ramsay bowed in defeat!"
 },
 {
 mal: "Adipoli! Saakshal Annapoorneshwari anugrahicha kaippunyam! 100/100!",
 trans: "Adipoli! Saakshal Annapoorneshwari anugrahicha kaippunyam! 100/100!",
 eng: "Sensational! Blessed with divine culinary magic! Pure Michelin 3-Star perfection!"
 },
 {
 mal: "Ini muthal neeyaanu ividuthe Head Chef! Kayyadikk makkale!",
 trans: "Ini muthal neeyaanu ividuthe Head Chef! Kayyadikk makkale!",
 eng: "From today onwards, YOU are the Executive Head Chef! Give a round of applause!"
 }
 ]
};

const RECIPES_DATA_3D = [
  {
    name: 'Gourmet Double Smash Burger',
    stage1Target: 'Vine Tomato & Red Onion',
    layers: [
      { name: 'Toasted Brioche Bun', type: 'bunBottom', color: 0xdeb887, radius: 1.1, height: 0.28 },
      { name: 'Sizzling Beef Patty', type: 'patty', color: 0x5c2c16, radius: 1.05, height: 0.24 },
      { name: 'Melted Cheddar Cheese', type: 'cheese', color: 0xf59e0b, radius: 1.1, height: 0.1 },
      { name: 'Crispy Sliced Bacon', type: 'bacon', color: 0xb91c1c, radius: 1.0, height: 0.12 },
      { name: 'Fresh Vine Tomato', type: 'tomato', color: 0xef4444, radius: 1.05, height: 0.16 },
      { name: 'Golden Brioche Crown', type: 'bunTop', color: 0xdeb887, radius: 1.1, height: 0.45 }
    ]
  }
];

class MobileAdCookingGame3D {
 constructor() {
 this.canvas = document.getElementById('cooking-game-canvas');
 if (!this.canvas) return;

 // Game Progression State
 this.recipe = RECIPES_DATA_3D[0];
 this.stage = 1; // 1: Slice, 2: Flip, 3: Stack, 4: Taste
 this.lastFailedStage = 1;
 this.coins = 1250;
 this.combo = 1;
 this.stars = 3;
 this.heatLevel = 2; // For app.js compatibility

 // Chef strictness tracking
 this.flipAccuracy = 'perfect'; // 'perfect' or 'borderline'
 this.maxLayerOffset = 0;

 // Stage 1: Slicing Spree State
 this.sliceProgress = 0;
 this.knifeChopTimer = 0;
 this.flyingSlices = [];

 // Stage 2: Sizzle & Timing Bar State
 this.needlePos = 10;
 this.needleSpeed = 75; // % per second
 this.needleDirection = 1;
 this.pattyFlipped = false;
 this.pattyVy = 0;
 this.pattyRotX = 0;
 this.smokeParticles = [];

 // Stage 3: Tower Stacker State
 this.stacked3DLayers = [];
 this.stackTargetLayers = this.recipe.layers;
 this.currentLayerIndex = 1;
 this.spatulaX = 0; // Relative to stack station (X = 4.2)
 this.spatulaSpeed = 2.4;
 this.spatulaDir = 1;
 this.falling3DItem = null;
 this.tiltOffset = 0;
 this.isToppled = false;

 // Stage 4: Judge Taste Test State
 this.judgeState = 'idle';
 this.orbitAngle = 0;

 // Camera Stations in 3D Space (Station 3 adjusted higher & wider for clear visibility)
 this.cameraStations = {
 1: { pos: new THREE.Vector3(-4.2, 3.2, 3.8), lookAt: new THREE.Vector3(-4.2, 0.8, 0.0) }, // Cutting
 2: { pos: new THREE.Vector3(0.0, 3.5, 4.0), lookAt: new THREE.Vector3(0.0, 0.7, 0.0) }, // Stove
 3: { pos: new THREE.Vector3(4.2, 4.3, 5.2), lookAt: new THREE.Vector3(4.2, 1.6, 0.0) }, // Stacker (High & Wide)
 4: { pos: new THREE.Vector3(4.2, 2.5, 3.2), lookAt: new THREE.Vector3(4.2, 1.1, 0.0) } // Judge Orbit
 };
 this.currentCamPos = this.cameraStations[1].pos.clone();
 this.currentCamLook = this.cameraStations[1].lookAt.clone();

 // Timing Loop
 this.lastTime = performance.now();
 this.animFrameId = null;

 // Initialize 3D Scene and Bind Controls
 this.initThree();
 this.build3DKitchen();
 this.bindDOM();
 this.initStage(1);
 this.startLoop();
 }

 /* =========================================================================
 1. THREE.JS INITIALIZATION
 ========================================================================= */
 initThree() {
  // Start with a safe default — the canvas is sized by CSS (width:100% height:100%).
  // We do NOT set updateStyle=true so Three.js won't override the CSS dimensions.
  // resizeCanvas() is called from app.js once the section is visible.
  const width  = 920;
  const height = 520;

  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0x18181b);
  this.scene.fog = new THREE.FogExp2(0x18181b, 0.025);

  this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  this.camera.position.copy(this.currentCamPos);

  this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
  // updateStyle = false → CSS keeps width:100% height:100% and fills the container
  this.renderer.setSize(width, height, false);
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

 // Lighting
 const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
 this.scene.add(ambientLight);

 const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
 dirLight.position.set(4, 12, 8);
 dirLight.castShadow = true;
 dirLight.shadow.mapSize.width = 1024;
 dirLight.shadow.mapSize.height = 1024;
 this.scene.add(dirLight);

 // Warm Station Spotlights
 this.spotCutting = new THREE.SpotLight(0xffecd2, 1.3, 14, Math.PI / 4, 0.25);
 this.spotCutting.position.set(-4.2, 6, 2.5);
 this.spotCutting.target.position.set(-4.2, 0.8, 0);
 this.scene.add(this.spotCutting);
 this.scene.add(this.spotCutting.target);

 this.spotStove = new THREE.SpotLight(0xffedd5, 1.4, 14, Math.PI / 4, 0.25);
 this.spotStove.position.set(0, 6, 2.5);
 this.spotStove.target.position.set(0, 0.8, 0);
 this.scene.add(this.spotStove);
 this.scene.add(this.spotStove.target);

 this.spotStack = new THREE.SpotLight(0xfff1e6, 1.4, 14, Math.PI / 4, 0.25);
 this.spotStack.position.set(4.2, 6, 2.5);
 this.spotStack.target.position.set(4.2, 1.2, 0);
 this.scene.add(this.spotStack);
 this.scene.add(this.spotStack.target);

 window.addEventListener('resize', () =>this.resizeCanvas());
 this.resizeCanvas();
 }

 resizeCanvas() {
  if (!this.canvas || !this.renderer || !this.camera) return;
  const viewport = document.getElementById('mobile-game-viewport');
  // clientWidth works here because this is called after the section is visible
  const width  = viewport ? viewport.clientWidth  : this.canvas.clientWidth;
  const height = viewport ? viewport.clientHeight : this.canvas.clientHeight;
  if (!width || !height) return;
  // Update WebGL pixel buffer to match actual display size; CSS still controls layout
  this.renderer.setSize(width, height, false);
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
 }

 /* =========================================================================
 2. BUILD 3D KITCHEN ENVIRONMENT & PROPS
 ========================================================================= */
 build3DKitchen() {
    // 1. Expansive Kitchen Floor (Dark Slate Tile)
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      roughness: 0.35,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.5, 10);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Extra-Wide Marble Countertop Surface (spans across the entire studio)
    const counterGeo = new THREE.BoxGeometry(42, 0.4, 6.8);
    const counterMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ef,
      roughness: 0.18,
      metalness: 0.08
    });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.set(0, 0.2, 0.8);
    counter.receiveShadow = true;
    this.scene.add(counter);

    // 3. Cabinet Base (Sleek charcoal matte oak)
    const baseGeo = new THREE.BoxGeometry(41.6, 2.5, 6.4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x16161a, roughness: 0.75 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -1.25, 0.8);
    this.scene.add(base);

    // 4. Large Back Wall with Restaurant Subway Tile Tone
    const wallGeo = new THREE.BoxGeometry(60, 18, 0.6);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.7, metalness: 0.1 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 7.5, -2.6);
    wall.receiveShadow = true;
    this.scene.add(wall);

    // Stainless Steel Backsplash Panel
    const backsplashGeo = new THREE.BoxGeometry(50, 2.4, 0.1);
    const backsplashMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.6 });
    const backsplash = new THREE.Mesh(backsplashGeo, backsplashMat);
    backsplash.position.set(0, 1.4, -2.25);
    this.scene.add(backsplash);

    // 5. Left & Right Studio Side Walls
    const sideWallGeo = new THREE.BoxGeometry(0.6, 18, 40);
    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(28, 7.5, 10);
    this.scene.add(rightWall);

    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-28, 7.5, 10);
    this.scene.add(leftWall);

    // 6. Overhead Stainless Steel Shelf across the Back Wall
    const shelfGeo = new THREE.BoxGeometry(46, 0.14, 1.4);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, 3.8, -1.8);
    this.scene.add(shelf);

    // 7. Right Counter Decorative Props (Fills the right side of the counter)
    const rightPassGroup = new THREE.Group();
    rightPassGroup.position.set(8.5, 0.4, 0);

    // Stainless Cloche / Platter Dome
    const clocheGeo = new THREE.SphereGeometry(1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const clocheMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.15 });
    const cloche = new THREE.Mesh(clocheGeo, clocheMat);
    cloche.position.set(3.8, 0, 0);
    rightPassGroup.add(cloche);

    const clocheHandle = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.1 })
    );
    clocheHandle.position.set(3.8, 1.25, 0);
    rightPassGroup.add(clocheHandle);

    // Condiment Bottles (Mustard & Ketchup)
    const bottleGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.9, 16);
    const ketchupMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const mustardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
    const ketchup = new THREE.Mesh(bottleGeo, ketchupMat);
    ketchup.position.set(1.2, 0.45, -0.4);
    rightPassGroup.add(ketchup);

    const mustard = new THREE.Mesh(bottleGeo, mustardMat);
    mustard.position.set(1.7, 0.45, -0.4);
    rightPassGroup.add(mustard);

    // Stack of Serving Plates on Shelf
    for (let p = 0; p < 5; p++) {
      const plateMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 0.7, 0.06, 24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      plateMesh.position.set(6.5, 3.88 + p * 0.07, -1.7);
      this.scene.add(plateMesh);
    }

    // Olive Oil Bottle on Shelf
    const oilMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.2, transparent: true, opacity: 0.85 });
    const oilBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.1, 16), oilMat);
    oilBottle.position.set(9.2, 4.4, -1.7);
    this.scene.add(oilBottle);

    this.scene.add(rightPassGroup);

    // Build Stations
    this.buildStage1Cutting();
    this.buildStage2Stove();
    this.buildStage3Stacker();
  }

 /* STAGE 1: 3D Cutting Board & Textured Vegetables */
 buildStage1Cutting() {
 this.stage1Group = new THREE.Group();
 this.stage1Group.position.set(-4.2, 0.4, 0);

 // Wooden Cutting Board
 const boardGeo = new THREE.BoxGeometry(3.6, 0.22, 2.5);
 const boardMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
 const board = new THREE.Mesh(boardGeo, boardMat);
 board.position.set(0, 0.11, 0);
 board.castShadow = true;
 board.receiveShadow = true;
 this.stage1Group.add(board);

 // Whole Tomato with Procedural Skin Texture & Green Calyx Leaves
 const tomatoGeo = new THREE.SphereGeometry(0.46, 32, 32);
 const tomatoMat = new THREE.MeshStandardMaterial({
 map: FoodTextureFactory.getTomatoSkinTexture(),
 roughness: 0.25,
 metalness: 0.05
 });
 this.wholeTomato = new THREE.Mesh(tomatoGeo, tomatoMat);
 this.wholeTomato.position.set(-0.65, 0.55, 0);
 this.wholeTomato.castShadow = true;

 // Green Calyx on Tomato Top
 const calyxGroup = new THREE.Group();
 calyxGroup.position.set(0, 0.45, 0);
 for (let i = 0; i < 5; i++) {
 const leafGeo = new THREE.ConeGeometry(0.08, 0.22, 5);
 const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
 const leaf = new THREE.Mesh(leafGeo, leafMat);
 leaf.rotation.z = Math.PI / 2.3;
 leaf.rotation.y = (i * Math.PI * 2) / 5;
 calyxGroup.add(leaf);
 }
 const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8);
 const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
 const stem = new THREE.Mesh(stemGeo, stemMat);
 stem.position.set(0, 0.08, 0);
 calyxGroup.add(stem);
 this.wholeTomato.add(calyxGroup);
 this.stage1Group.add(this.wholeTomato);

 // Whole Onion with Procedural Skin Striations Texture
 const onionGeo = new THREE.SphereGeometry(0.44, 32, 32);
 const onionMat = new THREE.MeshStandardMaterial({
 map: FoodTextureFactory.getOnionTexture(),
 roughness: 0.35
 });
 this.wholeOnion = new THREE.Mesh(onionGeo, onionMat);
 this.wholeOnion.position.set(0.65, 0.52, 0);
 this.wholeOnion.castShadow = true;

 // Papery Onion Stem Tip
 const onionTipGeo = new THREE.ConeGeometry(0.08, 0.24, 8);
 const onionTipMat = new THREE.MeshStandardMaterial({ color: 0x581c87 });
 const onionTip = new THREE.Mesh(onionTipGeo, onionTipMat);
 onionTip.position.set(0, 0.46, 0);
 this.wholeOnion.add(onionTip);
 this.stage1Group.add(this.wholeOnion);

 // 3D Chef Knife Group
 this.knifeGroup = new THREE.Group();
 this.knifeGroup.position.set(0.2, 1.4, 0);

 const bladeGeo = new THREE.BoxGeometry(2.0, 0.35, 0.04);
 const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.92, roughness: 0.12 });
 const blade = new THREE.Mesh(bladeGeo, bladeMat);
 blade.position.set(-0.4, 0, 0);
 blade.castShadow = true;
 this.knifeGroup.add(blade);

 const handleGeo = new THREE.BoxGeometry(0.8, 0.22, 0.12);
 const handleMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
 const handle = new THREE.Mesh(handleGeo, handleMat);
 handle.position.set(0.9, 0, 0);
 handle.castShadow = true;
 this.knifeGroup.add(handle);

 this.knifeGroup.rotation.z = -0.3;
 this.stage1Group.add(this.knifeGroup);

 this.scene.add(this.stage1Group);
 }

 /* STAGE 2: 3D Stove & Sizzling Pan */
 buildStage2Stove() {
 this.stage2Group = new THREE.Group();
 this.stage2Group.position.set(0, 0.4, 0);

 const burnerGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.12, 32);
 const burnerMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
 const burner = new THREE.Mesh(burnerGeo, burnerMat);
 burner.position.set(0, 0.06, 0);
 this.stage2Group.add(burner);

 const coilGeo = new THREE.TorusGeometry(1.1, 0.08, 16, 32);
 const coilMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
 const coil = new THREE.Mesh(coilGeo, coilMat);
 coil.rotation.x = Math.PI / 2;
 coil.position.set(0, 0.13, 0);
 this.stage2Group.add(coil);

 const panGeo = new THREE.CylinderGeometry(1.4, 1.25, 0.35, 32, 1, true);
 const panMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.3 });
 this.panMesh = new THREE.Mesh(panGeo, panMat);
 this.panMesh.position.set(0, 0.35, 0);
 this.panMesh.castShadow = true;
 this.stage2Group.add(this.panMesh);

 const panBaseGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.08, 32);
 const panBase = new THREE.Mesh(panBaseGeo, panMat);
 panBase.position.set(0, 0.2, 0);
 this.stage2Group.add(panBase);

 const panHandleGeo = new THREE.BoxGeometry(0.18, 0.14, 1.6);
 const panHandle = new THREE.Mesh(panHandleGeo, panMat);
 panHandle.position.set(0, 0.45, 1.7);
 panHandle.castShadow = true;
 this.stage2Group.add(panHandle);

 // 3D Sizzling Burger Patty with Charred Grill Texture
 const pattyGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.32, 32);
 const pattyMat = new THREE.MeshStandardMaterial({
 map: FoodTextureFactory.getPattyTexture(),
 roughness: 0.6
 });
 this.pattyMesh3D = new THREE.Mesh(pattyGeo, pattyMat);
 this.pattyMesh3D.position.set(0, 0.38, 0);
 this.pattyMesh3D.castShadow = true;
 this.stage2Group.add(this.pattyMesh3D);

 // Rising 3D Steam Particles
 this.steamGroup = new THREE.Group();
 for (let i = 0; i < 15; i++) {
 const steamGeo = new THREE.SphereGeometry(0.15 + Math.random() * 0.15, 8, 8);
 const steamMat = new THREE.MeshStandardMaterial({
 color: 0xffffff,
 transparent: true,
 opacity: 0.25,
 roughness: 1
 });
 const steam = new THREE.Mesh(steamGeo, steamMat);
 steam.position.set(
 (Math.random() - 0.5) * 1.4,
 0.5 + Math.random() * 1.8,
 (Math.random() - 0.5) * 1.4
 );
 this.steamGroup.add(steam);
 }
 this.stage2Group.add(this.steamGroup);

 this.scene.add(this.stage2Group);
 }

 /* STAGE 3: 3D Ceramic Plate, Stacker, Spatula Crane & Drop Laser Guide */
 buildStage3Stacker() {
 this.stage3Group = new THREE.Group();
 this.stage3Group.position.set(4.2, 0.4, 0);

 // Ceramic Serving Plate
 const plateGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.15, 32);
 const plateMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.05 });
 const plate = new THREE.Mesh(plateGeo, plateMat);
 plate.position.set(0, 0.08, 0);
 plate.receiveShadow = true;
 this.stage3Group.add(plate);

 // 3D Drop Target Projection Ring on Plate
 const targetRingGeo = new THREE.RingGeometry(0.3, 0.42, 32);
 this.targetRingMat = new THREE.MeshBasicMaterial({
 color: 0x10b981,
 side: THREE.DoubleSide,
 transparent: true,
 opacity: 0.75
 });
 this.targetRingMesh = new THREE.Mesh(targetRingGeo, this.targetRingMat);
 this.targetRingMesh.rotation.x = Math.PI / 2;
 this.targetRingMesh.position.set(0, 0.17, 0);
 this.stage3Group.add(this.targetRingMesh);

 // 3D Burger Stack Group
 this.burgerStackGroup3D = new THREE.Group();
 this.burgerStackGroup3D.position.set(0, 0.16, 0);
 this.stage3Group.add(this.burgerStackGroup3D);

 // 3D Spatula Crane (lowered to Y = 2.7 for full, clear visibility)
 this.spatulaCrane3D = new THREE.Group();
 this.spatulaCrane3D.position.set(0, 2.7, 0);

 // Spatula Rod
 const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16);
 const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
 const rod = new THREE.Mesh(rodGeo, rodMat);
 rod.position.set(0, 0.7, 0);
 this.spatulaCrane3D.add(rod);

 // Spatula Flat Head
 const headGeo = new THREE.BoxGeometry(1.6, 0.06, 1.3);
 const headMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
 const head = new THREE.Mesh(headGeo, headMat);
 head.position.set(0, 0, 0);
 this.spatulaCrane3D.add(head);

 // Vertical Drop Aiming Laser Line
 const laserGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.5, 8);
 this.laserMat = new THREE.MeshBasicMaterial({
 color: 0x10b981,
 transparent: true,
 opacity: 0.8
 });
 this.laserMesh = new THREE.Mesh(laserGeo, this.laserMat);
 this.laserMesh.position.set(0, -1.25, 0);
 this.spatulaCrane3D.add(this.laserMesh);

 // Held Ingredient Container
 this.heldIngredientGroup3D = new THREE.Group();
 this.heldIngredientGroup3D.position.set(0, 0.22, 0);
 this.spatulaCrane3D.add(this.heldIngredientGroup3D);

 this.stage3Group.add(this.spatulaCrane3D);
 this.scene.add(this.stage3Group);
 }

 /* Helper to create 3D Burger Mesh Layer with Realistic Textures */
 create3DLayerMesh(layerData) {
 const group = new THREE.Group();
 const type = layerData.type;

 if (type === 'bunBottom') {
 const geo = new THREE.CylinderGeometry(1.1, 1.05, 0.28, 32);
 const mat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.6 });
 const mesh = new THREE.Mesh(geo, mat);
 mesh.castShadow = true;
 group.add(mesh);
 } else if (type === 'patty') {
 const geo = new THREE.CylinderGeometry(1.05, 1.05, 0.24, 32);
 const mat = new THREE.MeshStandardMaterial({
 map: FoodTextureFactory.getPattyTexture(),
 roughness: 0.65
 });
 const mesh = new THREE.Mesh(geo, mat);
 mesh.castShadow = true;
 group.add(mesh);
 } else if (type === 'cheese') {
 const geo = new THREE.BoxGeometry(1.5, 0.08, 1.5);
 const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
 const mesh = new THREE.Mesh(geo, mat);
 mesh.rotation.y = Math.PI / 4;
 mesh.castShadow = true;
 group.add(mesh);
 } else if (type === 'bacon') {
 for (let i = -0.3; i <= 0.3; i += 0.6) {
 const geo = new THREE.BoxGeometry(1.4, 0.08, 0.35);
 const mat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
 const mesh = new THREE.Mesh(geo, mat);
 mesh.position.set(0, 0, i);
 mesh.castShadow = true;
 group.add(mesh);
 }
 } else if (type === 'tomato') {
 const geo = new THREE.CylinderGeometry(1.05, 1.05, 0.16, 32);
 const mat = new THREE.MeshStandardMaterial({
 map: FoodTextureFactory.getTomatoSliceTexture(),
 roughness: 0.3
 });
 const mesh = new THREE.Mesh(geo, mat);
 mesh.castShadow = true;
 group.add(mesh);
 } else if (type === 'bunTop') {
 const geo = new THREE.SphereGeometry(1.12, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
 const mat = new THREE.MeshStandardMaterial({
 map: FoodTextureFactory.getBunTopTexture(),
 roughness: 0.55
 });
 const mesh = new THREE.Mesh(geo, mat);
 mesh.position.set(0, -0.05, 0);
 mesh.castShadow = true;
 group.add(mesh);
 } else {
 const geo = new THREE.CylinderGeometry(1.0, 1.0, 0.2, 32);
 const mat = new THREE.MeshStandardMaterial({ color: layerData.color || 0xdeb887, roughness: 0.5 });
 group.add(new THREE.Mesh(geo, mat));
 }

 return group;
 }

 /* =========================================================================
 3. DOM BINDINGS & HUD OVERLAYS
 ========================================================================= */
 bindDOM() {
 this.coinDisplay = document.getElementById('ad-coin-count');
 this.comboDisplay = document.getElementById('ad-combo-count');
 this.starDisplay = document.getElementById('ad-star-rating');

 this.tabs = [
 document.getElementById('tab-stage-1'),
 document.getElementById('tab-stage-2'),
 document.getElementById('tab-stage-3'),
 document.getElementById('tab-stage-4')
 ];
 this.tabs.forEach((tab, index) =>{
 if (tab) {
 tab.addEventListener('click', () =>this.initStage(index + 1));
 }
 });

 this.overlaySlice = document.getElementById('overlay-stage-slice');
 this.overlayFlip = document.getElementById('overlay-stage-flip');
 this.overlayStack = document.getElementById('overlay-stage-stack');
 this.overlayJudge = document.getElementById('overlay-stage-judge');

 this.sliceBar = document.getElementById('slice-progress-bar');
 this.slicePercentText = document.getElementById('slice-percent-text');
 this.btnSlice = document.getElementById('btn-ad-slice-action');
 if (this.btnSlice) this.btnSlice.addEventListener('click', () =>this.handleSliceAction());

 this.timingNeedleEl = document.getElementById('timing-needle');
 this.btnFlip = document.getElementById('btn-ad-flip-action');
 if (this.btnFlip) this.btnFlip.addEventListener('click', () =>this.handleFlipAction());

 // Stage 3 HUD elements
 this.stackCountText = document.getElementById('stacker-layer-count');
 this.stackWobbleTag = document.getElementById('stacker-wobble-tag');
 this.tiltMarker = document.getElementById('tilt-meter-marker');
 this.btnDrop = document.getElementById('btn-ad-drop-action');
 this.hoveringNameEl = document.getElementById('stacker-hovering-name');
 if (this.btnDrop) this.btnDrop.addEventListener('click', () =>this.handleDropAction());

  this.btnTaste = document.getElementById('btn-ad-taste-action');
  if (this.btnTaste) {
    this.btnTaste.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleTasteAction();
    });
  }

  // Tap to click to review chef: trigger taste test from chef theater stage, character, or heartbeat bar
  const judgeStageEl = document.getElementById('judge-theater-stage');
  if (judgeStageEl) {
    judgeStageEl.addEventListener('click', (e) => {
      if (this.stage === 4 && this.judgeState === 'idle') {
        e.stopPropagation();
        this.handleTasteAction();
      }
    });
  }

  const judgeCharEl = document.getElementById('judge-character');
  if (judgeCharEl) {
    judgeCharEl.addEventListener('click', (e) => {
      if (this.stage === 4 && this.judgeState === 'idle') {
        e.stopPropagation();
        this.handleTasteAction();
      }
    });
  }

  const heartbeatBoxEl = document.getElementById('judge-heartbeat-box');
  if (heartbeatBoxEl) {
    heartbeatBoxEl.addEventListener('click', (e) => {
      if (this.stage === 4 && this.judgeState === 'idle') {
        e.stopPropagation();
        this.handleTasteAction();
      }
    });
  }

  if (this.overlayJudge) {
    this.overlayJudge.addEventListener('click', (e) => {
      if (this.stage === 4 && this.judgeState === 'idle') {
        if (!e.target.closest('#btn-ad-taste-action')) {
          this.handleTasteAction();
        }
      }
    });
  }

 // Modal elements
 this.resultModal = document.getElementById('mobile-ad-result-modal');
 this.resultCard = document.getElementById('ad-result-card');
 this.resultStamp = document.getElementById('ad-result-stamp');
 this.resultHeadline = document.getElementById('ad-result-headline');
 this.resultDesc = document.getElementById('ad-result-desc');
 this.resultRewardVal = document.getElementById('ad-reward-val');

  // Close button on result modal card
  const btnCloseResult = document.getElementById('btn-close-ad-result');
  if (btnCloseResult) {
    btnCloseResult.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideResultModal();
    });

  }

  // Close modal when clicking backdrop outside the card
  if (this.resultModal) {
    this.resultModal.addEventListener('click', (e) => {
      if (e.target === this.resultModal) {
        this.hideResultModal();
      }
    });
  }

  // 3 Chefs Review Panel button in result card
  const btnOpenJudges = document.getElementById('btn-open-judges-modal');
  if (btnOpenJudges) {
    btnOpenJudges.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showJudgesReviewModal();
    });
  }

  // Cook Another Dish button inside judges panel
  const btnRestartComp = document.getElementById('btn-restart-competition');
  if (btnRestartComp) {
    btnRestartComp.addEventListener('click', () => {
      const jm = document.getElementById('judges-review-modal');
      if (jm) jm.classList.remove('active');
      this.hideResultModal();
      this.initStage(1);
    });
  }

 // Malayalam Verdict in Modal
 this.verdictMalayalamMain = document.getElementById('verdict-malayalam-main');
 this.verdictTranslitSub = document.getElementById('verdict-translit-sub');

 this.btnFakeInstall = document.getElementById('btn-fake-install');
 if (this.btnFakeInstall) {
 this.btnFakeInstall.addEventListener('click', () =>{
 if (window.soundEngine) {
 window.soundEngine.playBoing();
 window.soundEngine.playCoin();
 }
 this.showFloatingPopup('UNBLOCKED 3D GAME ACTIVE!', window.innerWidth / 2, 260, '#34d399');
 });
 }

 this.btnRetry = document.getElementById('btn-ad-retry');
 if (this.btnRetry) {
 this.btnRetry.addEventListener('click', () =>{
 this.hideResultModal();
 this.initStage(this.lastFailedStage || 1);
 });
 }

 this.btnNextLevel = document.getElementById('btn-ad-next-level');
 if (this.btnNextLevel) {
 this.btnNextLevel.addEventListener('click', () =>{
 this.hideResultModal();
 this.initStage(1);
 });
 }

 const resetBtn = document.getElementById('btn-reset-mobile-game');
 if (resetBtn) {
 resetBtn.addEventListener('click', () =>{
 this.hideResultModal();
 this.initStage(1);
 });
 }

 // Direct canvas click/tap trigger
 this.canvas.addEventListener('pointerdown', () =>{
 if (this.stage === 1) this.handleSliceAction();
 else if (this.stage === 2) this.handleFlipAction();
 else if (this.stage === 3) this.handleDropAction();
 else if (this.stage === 4 && this.judgeState === 'idle') this.handleTasteAction();
 });

  const viewportEl = document.getElementById('mobile-game-viewport');
  if (viewportEl) {
    viewportEl.addEventListener('click', (e) => {
      if (this.stage === 4 && this.judgeState === 'idle') {
        if (!e.target.closest('.stage-tab') && !e.target.closest('#btn-reset-mobile-game') && !e.target.closest('#btn-toggle-sound')) {
          this.handleTasteAction();
        }
      }
    });
  }
 }

 /* =========================================================================
 4. STAGE INITIALIZATION & STATE SWITCHER
 ========================================================================= */
 initStage(stageNum) {
 this.stage = stageNum;
 this.updateStats();

 // Update Stage Tabs
 this.tabs.forEach((t, i) =>{
 if (t) {
 if (i + 1 === stageNum) t.classList.add('active');
 else t.classList.remove('active');
 }
 });

 [this.overlaySlice, this.overlayFlip, this.overlayStack, this.overlayJudge].forEach(o =>{
 if (o) o.style.display = 'none';
 });
 this.resetJudgeCharacter();

 const finger = document.getElementById('ad-tutorial-finger');
 const fingerText = document.getElementById('finger-instruction-text');

 if (stageNum === 1) {
 if (this.overlaySlice) this.overlaySlice.style.display = 'flex';
 this.sliceProgress = 0;
 this.updateSliceHUD();
 if (finger && fingerText) {
 finger.style.display = 'flex';
 finger.style.top = '48%';
 finger.style.left = '50%';
 fingerText.textContent = 'TAP RAPIDLY TO SLICE!';
 }
 if (window.soundEngine) window.soundEngine.stopSizzle();

 } else if (stageNum === 2) {
 if (this.overlayFlip) this.overlayFlip.style.display = 'flex';
 this.needlePos = 10;
 this.needleDirection = 1;
 this.pattyFlipped = false;
 this.pattyVy = 0;
 this.pattyRotX = 0;
 this.pattyMesh3D.position.set(0, 0.38, 0);
 this.pattyMesh3D.rotation.set(0, 0, 0);

 if (finger && fingerText) {
 finger.style.display = 'flex';
 finger.style.top = '42%';
 finger.style.left = '50%';
 fingerText.textContent = 'FLIP AT THE GREEN ZONE!';
 }
 if (window.soundEngine) window.soundEngine.startSizzle(0.4);

 } else if (stageNum === 3) {
      if (this.spatulaCrane3D) this.spatulaCrane3D.visible = true;
 if (this.overlayStack) this.overlayStack.style.display = 'flex';

 // Reset burger stack group
 while (this.burgerStackGroup3D.children.length >0) {
 this.burgerStackGroup3D.remove(this.burgerStackGroup3D.children[0]);
 }

 // Base brioche bun on plate
 const baseBun3D = this.create3DLayerMesh(this.recipe.layers[0]);
 baseBun3D.position.set(0, 0.14, 0);
 this.burgerStackGroup3D.add(baseBun3D);

 this.stacked3DLayers = [{ mesh: baseBun3D, y: 0.14 }];
 this.currentLayerIndex = 1;
 this.tiltOffset = 0;
 this.maxLayerOffset = 0;
 this.isToppled = false;
 this.burgerStackGroup3D.rotation.z = 0;
 this.updateStackHUD();
 this.updateHeldIngredient3D();

 if (finger && fingerText) {
 finger.style.display = 'flex';
 finger.style.top = '36%';
 finger.style.left = '50%';
 fingerText.textContent = 'ALIGN WITH LASER & TAP TO DROP!';
 }
 if (window.soundEngine) window.soundEngine.stopSizzle();

 } else if (stageNum === 4) {
    const judgeStage = document.getElementById('judge-theater-stage');
    if (judgeStage) judgeStage.classList.add('clickable');
      if (this.spatulaCrane3D) this.spatulaCrane3D.visible = false;
 if (this.overlayJudge) this.overlayJudge.style.display = 'flex';
 this.judgeState = 'idle';
 this.orbitAngle = 0;
 this.resetJudgeCharacter();
 const speech = document.getElementById('judge-drama-speech');
 const actionWrap = document.getElementById('judge-start-action-wrap');
      const heartbeatBox = document.getElementById('judge-heartbeat-box');
      if (heartbeatBox) heartbeatBox.style.display = 'inline-flex';
 if (speech) speech.style.display = 'none';
 if (actionWrap) actionWrap.style.display = 'flex';

 if (finger && fingerText) {
 finger.style.display = 'flex';
 finger.style.top = '60%';
 finger.style.left = '50%';
    finger.style.top = '45%';
    fingerText.textContent = 'TAP CHEF TO REVIEW DISH!';
 }
 if (window.soundEngine) window.soundEngine.stopSizzle();
 }
 }

 /* =========================================================================
 STAGE 1: 3D SLICING FRENZY LOGIC
 ========================================================================= */
 handleSliceAction() {
 if (this.stage !== 1) return;

 this.sliceProgress = Math.min(100, this.sliceProgress + 15);
 this.addCoins(100);
 this.combo++;
 this.updateStats();

 this.knifeChopTimer = 0.18;

 if (window.soundEngine) {
 window.soundEngine.playChop();
 window.soundEngine.playWhoosh();
 }

 const finger = document.getElementById('ad-tutorial-finger');
 if (finger) finger.style.display = 'none';

 // Spawn 3D flying food slice with seed/concentric textures
 const isTomato = Math.random() >0.5;
 const sliceGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24);
 const sliceMat = new THREE.MeshStandardMaterial({
 map: isTomato ? FoodTextureFactory.getTomatoSliceTexture() : FoodTextureFactory.getOnionTexture(),
 roughness: 0.3
 });
 const sliceMesh = new THREE.Mesh(sliceGeo, sliceMat);
 sliceMesh.position.set(
 -4.2 + (Math.random() - 0.5) * 0.8,
 0.8,
 (Math.random() - 0.5) * 0.6
 );
 sliceMesh.castShadow = true;
 this.scene.add(sliceMesh);

 this.flyingSlices.push({
 mesh: sliceMesh,
 vx: (Math.random() - 0.5) * 4,
 vy: 3.5 + Math.random() * 2.5,
 vz: 1.5 + Math.random() * 2,
 rx: Math.random() * 8,
 ry: Math.random() * 8,
 life: 0.9
 });

 this.showFloatingPopup('CHOP! +100 COINS', window.innerWidth / 2, 240, '#facc15');
 this.updateSliceHUD();

 if (this.sliceProgress >= 100) {
 if (window.soundEngine) {
 window.soundEngine.playVictoryFanfare();
 window.soundEngine.playCoin();
 }
 this.showFloatingPopup('STAGE 1 CLEARED! +500 COINS', window.innerWidth / 2, 220, '#34d399');
 this.addCoins(500);
 setTimeout(() =>this.initStage(2), 900);
 }
 }

 updateSliceHUD() {
 if (this.sliceBar) this.sliceBar.style.width = `${this.sliceProgress}%`;
 if (this.slicePercentText) this.slicePercentText.textContent = `${Math.round(this.sliceProgress)}%`;
 }

 /* =========================================================================
 STAGE 2: 3D SIZZLE & FLIP TIMING BAR LOGIC
 ========================================================================= */
 handleFlipAction() {
 if (this.stage !== 2 || this.pattyFlipped) return;
 this.pattyFlipped = true;

 const finger = document.getElementById('ad-tutorial-finger');
 if (finger) finger.style.display = 'none';

 const pos = this.needlePos;

 // Green Zone: 30% - 70%
 if (pos >= 30 && pos <= 70) {
 // Check if dead center (40-60%) for strict chef evaluation
 if (pos >= 40 && pos <= 60) {
 this.flipAccuracy = 'perfect';
 } else {
 this.flipAccuracy = 'borderline';
 }

 if (window.soundEngine) {
 window.soundEngine.playFlip();
 window.soundEngine.playDing();
 window.soundEngine.playCoin();
 }
 this.pattyVy = 5.2;

 this.showFloatingPopup('PERFECT SEAR! +500 COINS', window.innerWidth / 2, 220, '#34d399');
 this.addCoins(500);
 this.combo += 2;
 this.updateStats();

 setTimeout(() =>this.initStage(3), 1300);

 } else if (pos < 30) {
 this.lastFailedStage = 2;
 if (window.soundEngine) {
 window.soundEngine.playFailBuzzer();
 window.soundEngine.playSplat();
 }
 this.triggerScreenShake();
 this.showFloatingPopup('RAW & COLD! FAIL!', window.innerWidth / 2, 220, '#ef4444');

 const roast = this.pickMalayalamRoast('raw');
 setTimeout(() =>{
 this.showResultModal(false, 'IT\'S COLD AND RAW!', roast);
 }, 900);

 } else {
 this.lastFailedStage = 2;
 if (window.soundEngine) {
 window.soundEngine.playFailBuzzer();
 window.soundEngine.playHorn();
 }
 this.triggerScreenShake();
 this.showFloatingPopup('CHARRED TO ASHES!', window.innerWidth / 2, 220, '#ef4444');

 const roast = this.pickMalayalamRoast('burnt');
 setTimeout(() =>{
 this.showResultModal(false, 'BURNT TO A CRISP!', roast);
 }, 900);
 }
 }

 /* =========================================================================
 STAGE 3: 3D BURGER TOWER STACKER LOGIC
 ========================================================================= */
 updateHeldIngredient3D() {
 while (this.heldIngredientGroup3D.children.length >0) {
 this.heldIngredientGroup3D.remove(this.heldIngredientGroup3D.children[0]);
 }
 if (this.currentLayerIndex < this.stackTargetLayers.length) {
 const nextLayerData = this.stackTargetLayers[this.currentLayerIndex];
 const heldMesh = this.create3DLayerMesh(nextLayerData);
 this.heldIngredientGroup3D.add(heldMesh);

 // Update HUD badge with preview name
 if (this.hoveringNameEl) {
 this.hoveringNameEl.textContent = nextLayerData.name;
 }
 }
 }

 handleDropAction() {
 if (this.stage !== 3 || this.falling3DItem || this.isToppled) return;

 const finger = document.getElementById('ad-tutorial-finger');
 if (finger) finger.style.display = 'none';

 if (this.currentLayerIndex < this.stackTargetLayers.length) {
 const layerData = this.stackTargetLayers[this.currentLayerIndex];
 const dropMesh = this.create3DLayerMesh(layerData);

 // World position of spatula
 const dropX = this.spatulaCrane3D.position.x;
 dropMesh.position.set(dropX, 2.9, 0);
 this.stage3Group.add(dropMesh);

 while (this.heldIngredientGroup3D.children.length >0) {
 this.heldIngredientGroup3D.remove(this.heldIngredientGroup3D.children[0]);
 }

 const targetY = 0.14 + (this.stacked3DLayers.length * 0.24);

 this.falling3DItem = {
 mesh: dropMesh,
 layerData: layerData,
 x: dropX,
 y: 2.9,
 vy: 0,
 targetY: targetY
 };

 if (window.soundEngine) window.soundEngine.playWhoosh();
 }
 }

 on3DLayerLanded() {
 if (!this.falling3DItem) return;

 const item = this.falling3DItem;
 this.falling3DItem = null;

 // Attach mesh to burgerStackGroup3D
 this.stage3Group.remove(item.mesh);
 item.mesh.position.set(item.x, item.targetY, 0);
 this.burgerStackGroup3D.add(item.mesh);

 // Calculate offset
 const offset = item.x;
 this.tiltOffset += offset * 0.45;
 this.maxLayerOffset = Math.max(this.maxLayerOffset, Math.abs(offset));

 this.stacked3DLayers.push({ mesh: item.mesh, y: item.targetY });
 this.currentLayerIndex++;

 if (window.soundEngine) {
 window.soundEngine.playChop();
 window.soundEngine.playCoin();
 }

 if (Math.abs(offset) < 0.25) {
 this.showFloatingPopup('PERFECT DROP! +200 COINS', window.innerWidth / 2, 220, '#facc15');
 this.addCoins(200);
 } else {
 this.showFloatingPopup('BALANCED! +100 COINS', window.innerWidth / 2, 220, '#60a5fa');
 this.addCoins(100);
 }

 this.updateStackHUD();
 this.updateHeldIngredient3D();

 // Check if toppled
 if (Math.abs(this.tiltOffset) >1.25) {
 this.isToppled = true;
 this.lastFailedStage = 3;
 if (window.soundEngine) {
 window.soundEngine.playFailBuzzer();
 window.soundEngine.playBoing();
 }
 this.triggerScreenShake();
 this.showFloatingPopup('TOWER TOPPLED!', window.innerWidth / 2, 220, '#ef4444');

 const roast = this.pickMalayalamRoast('toppled');
 setTimeout(() =>{
 this.showResultModal(false, 'BURGER TOPPLED OVER!', roast);
 }, 1000);
 return;
 }

 // All layers stacked
 if (this.currentLayerIndex >= this.stackTargetLayers.length) {
 if (window.soundEngine) {
 window.soundEngine.playVictoryFanfare();
 window.soundEngine.playApplause();
 }
 this.showFloatingPopup('GIGA BURGER COMPLETED!', window.innerWidth / 2, 200, '#34d399');
 this.addCoins(800);
 setTimeout(() =>this.initStage(4), 1200);
 }
 }

 updateStackHUD() {
 if (this.stackCountText) {
 this.stackCountText.textContent = `${this.stacked3DLayers.length} / ${this.stackTargetLayers.length}`;
 }

 if (this.tiltMarker) {
 const clampedTilt = Math.max(-1.5, Math.min(1.5, this.tiltOffset));
 const percent = 50 + (clampedTilt / 1.5) * 45;
 this.tiltMarker.style.left = `${percent}%`;
 }

 if (this.stackWobbleTag) {
 if (Math.abs(this.tiltOffset) < 0.35) {
 this.stackWobbleTag.className = 'wobble-tag-safe';
 this.stackWobbleTag.textContent = 'PERFECT 3D BALANCE';
 } else if (Math.abs(this.tiltOffset) < 0.85) {
 this.stackWobbleTag.className = 'wobble-tag-safe';
 this.stackWobbleTag.textContent = 'SLIGHT LEAN';
 } else {
 this.stackWobbleTag.className = 'wobble-tag-danger';
 this.stackWobbleTag.textContent = 'DANGER: ABOUT TO TOPPLE!';
 }
 }
 }

 /* =========================================================================
 STAGE 4: STRICT CHEF EVALUATION & MALAYALAM ROASTS
 ========================================================================= */
 pickMalayalamRoast(type) {
 const pool = MALAYALAM_ROASTS[type] || MALAYALAM_ROASTS.raw;
 return pool[Math.floor(Math.random() * pool.length)];
 }

 resetJudgeCharacter() {
 const judgeChar = document.getElementById('judge-character');
 const judgeStatusBadge = document.getElementById('judge-status-badge');
 const judgeActionText = document.getElementById('judge-action-status-text');
 const biteSample = document.getElementById('bite-sample');
 const biteCutout = document.getElementById('bite-cutout-effect');
 const crumbsCloud = document.getElementById('dish-crumbs-cloud');
 const calloutEl = document.getElementById('judge-reaction-callout');
 const goldenRays = document.getElementById('fx-golden-rays');
 const stormCloud = document.getElementById('fx-storm-cloud');

 if (judgeChar) {
 judgeChar.className = 'judge-character';
 }
 if (judgeStatusBadge) {
 judgeStatusBadge.textContent = 'WAITING FOR PRESENTATION';
 judgeStatusBadge.style.background = '#f59e0b';
 judgeStatusBadge.style.color = '#000000';
 }
 if (judgeActionText) {
    judgeActionText.textContent = '👉 TAP CHEF OR CLICK PRESENT TO REVIEW! 👈';
 }
    const judgeStage = document.getElementById('judge-theater-stage');
    if (judgeStage) judgeStage.classList.add('clickable');
 if (biteSample) biteSample.style.display = 'none';
 if (biteCutout) biteCutout.style.display = 'none';
 if (crumbsCloud) crumbsCloud.style.display = 'none';
 if (calloutEl) calloutEl.style.display = 'none';
 if (goldenRays) goldenRays.style.opacity = '0';
 if (stormCloud) stormCloud.style.opacity = '0';
 }

 handleTasteAction() {
 if (this.stage !== 4 || this.judgeState !== 'idle') return;
 this.judgeState = 'evaluating';

 const finger = document.getElementById('ad-tutorial-finger');
 if (finger) finger.style.display = 'none';

 const actionWrap = document.getElementById('judge-start-action-wrap');
 const heartbeatBox = document.getElementById('judge-heartbeat-box');
 const speech = document.getElementById('judge-drama-speech');
 if (speech) speech.style.display = 'none';
 if (actionWrap) actionWrap.style.display = 'none';
 if (heartbeatBox) heartbeatBox.style.display = 'inline-flex';
    const judgeStage = document.getElementById('judge-theater-stage');
    if (judgeStage) judgeStage.classList.remove('clickable');

 const judgeChar = document.getElementById('judge-character');
 const judgeStatusBadge = document.getElementById('judge-status-badge');
 const judgeActionText = document.getElementById('judge-action-status-text');
 const biteSample = document.getElementById('bite-sample');
 const biteCutout = document.getElementById('bite-cutout-effect');
 const crumbsCloud = document.getElementById('dish-crumbs-cloud');
 const calloutEl = document.getElementById('judge-reaction-callout');
 const calloutEmoji = document.getElementById('callout-emoji');
 const calloutText = document.getElementById('callout-text');
 const goldenRays = document.getElementById('fx-golden-rays');
 const stormCloud = document.getElementById('fx-storm-cloud');

 // STRICT CHEF EVALUATION CRITERIA:
 const isCrooked = Math.abs(this.tiltOffset) > 0.35 || this.maxLayerOffset > 0.42;
 const isSloppyFlip = this.flipAccuracy === 'borderline';
 const isBurnt = this.flipResult === 'burnt';
 const isRaw = this.flipResult === 'raw';
 const isStrictFail = isCrooked || isSloppyFlip || isBurnt || isRaw;

 // === PHASE 1: Taking First Bite (0ms) ===
 if (judgeStatusBadge) {
 judgeStatusBadge.textContent = 'TAKING FIRST BITE...';
 judgeStatusBadge.style.background = '#38bdf8';
 judgeStatusBadge.style.color = '#000000';
 }
 if (judgeActionText) {
 judgeActionText.textContent = 'CHEF IS CUTTING A BITE OF YOUR BURGER...';
 }
 if (judgeChar) {
 judgeChar.className = 'judge-character state-taking-bite';
 }
 if (biteSample) biteSample.style.display = 'inline-block';

 if (window.soundEngine) {
 window.soundEngine.init();
 window.soundEngine.playHeartbeat();
 }

 // Fork bite touches mouth (500ms)
 setTimeout(() => {
 if (biteCutout) biteCutout.style.display = 'block';
 if (crumbsCloud) {
 crumbsCloud.style.display = 'block';
 crumbsCloud.style.animation = 'none';
 void crumbsCloud.offsetWidth;
 crumbsCloud.style.animation = 'crumbs-burst 0.6s ease-out';
 }
 if (calloutEl && calloutEmoji && calloutText) {
 calloutEl.style.display = 'flex';
 calloutEmoji.textContent = '🍴';
 calloutText.textContent = '*CHOMP CRUNCH!*';
 }
 if (window.soundEngine) {
 window.soundEngine.playBiteChomp();
 }
 }, 500);

 // === PHASE 2: Chewing & Pondering (950ms) ===
 setTimeout(() => {
 if (judgeStatusBadge) {
 judgeStatusBadge.textContent = 'EVALUATING FLAVOR PROFILE...';
 judgeStatusBadge.style.background = '#facc15';
 judgeStatusBadge.style.color = '#000000';
 }
 if (judgeActionText) {
 judgeActionText.textContent = 'PALATE SENSORS ACTIVE: CRUNCH, DONENESS, SEASONING...';
 }
 if (judgeChar) {
 judgeChar.className = 'judge-character state-chewing';
 }
 if (biteSample) biteSample.style.display = 'none';

 if (calloutEl && calloutEmoji && calloutText) {
 calloutEmoji.textContent = '🤔';
 calloutText.textContent = 'Munching & Analyzing...';
 }

 if (window.soundEngine) {
 window.soundEngine.playChewing();
 setTimeout(() => { if (window.soundEngine) window.soundEngine.playChewing(); }, 350);
 setTimeout(() => { if (window.soundEngine) { window.soundEngine.playChewing(); window.soundEngine.playHeartbeat(); } }, 700);
 setTimeout(() => { if (window.soundEngine) window.soundEngine.playChewing(); }, 1050);
 }
 }, 950);

 // Mid-chew suspense hint (1700ms)
 setTimeout(() => {
 if (calloutEl && calloutEmoji && calloutText) {
 if (!isStrictFail) {
 calloutEmoji.textContent = '😋';
 calloutText.textContent = 'Flavors blending beautifully...';
 } else {
 calloutEmoji.textContent = '🤨';
 calloutText.textContent = 'Something is wrong with this flavor...';
 }
 }
 if (window.soundEngine) window.soundEngine.playHeartbeat();
 }, 1700);

 // === PHASE 3: The Big Reaction Reveal (2400ms) ===
 setTimeout(() => {
 this.judgeState = 'done';
 if (heartbeatBox) heartbeatBox.style.display = 'none';

 const malQuoteEl = document.getElementById('judge-malayalam-quote');
 const translitQuoteEl = document.getElementById('judge-translit-quote');
 const engQuoteEl = document.getElementById('judge-speech-text');
 const speechAvatar = document.getElementById('judge-speech-avatar');

 if (!isStrictFail) {
 // --- DELIGHTFUL WIN REACTION (Stars, Halo, Golden Rays, Double Thumbs Up) ---
 const roast = this.pickMalayalamRoast('win');
 if (judgeStatusBadge) {
 judgeStatusBadge.textContent = '🏆 10/10 GOURMET MASTERPIECE!';
 judgeStatusBadge.style.background = '#10b981';
 judgeStatusBadge.style.color = '#ffffff';
 }
 if (judgeChar) {
 judgeChar.className = 'judge-character state-reaction-good';
 }
 if (goldenRays) goldenRays.style.opacity = '1';
 if (stormCloud) stormCloud.style.opacity = '0';

 if (calloutEl && calloutEmoji && calloutText) {
 calloutEl.style.display = 'flex';
 calloutEmoji.textContent = '✨';
 calloutText.textContent = 'PURE CULINARY BLISS! (10/10)';
 }

 if (speech) speech.style.display = 'inline-flex';
 if (speechAvatar) speechAvatar.textContent = 'CHEF';
 if (malQuoteEl) malQuoteEl.textContent = `"${roast.mal}"`;
 if (translitQuoteEl) translitQuoteEl.textContent = `"${roast.trans}"`;
 if (engQuoteEl) engQuoteEl.textContent = `"${roast.eng}"`;

 if (window.soundEngine) {
 window.soundEngine.playHeavenlyChord();
 window.soundEngine.playVictoryFanfare();
 window.soundEngine.playApplause();
 window.soundEngine.playCoin();
 }

 setTimeout(() => {
 this.showResultModal(true, 'LEVEL 100 MAFIA CHEF!', roast);
 }, 2500);

 } else {
 // --- SAVAGE HORRIFIED REACTION (Steam from ears, Spirals, Green/Red Face, Gagging) ---
 this.lastFailedStage = 4;
 const roastType = isBurnt ? 'burnt' : (isRaw ? 'raw' : 'crookedReject');
 const roast = this.pickMalayalamRoast(roastType);

 if (judgeStatusBadge) {
 judgeStatusBadge.textContent = isBurnt ? '🔥 CHARRED ASH DETECTED!' : '💀 0/10 BIOHAZARD DETECTED!';
 judgeStatusBadge.style.background = '#ef4444';
 judgeStatusBadge.style.color = '#ffffff';
 }
 if (judgeChar) {
 judgeChar.className = `judge-character state-reaction-bad ${isBurnt ? 'burnt-head' : ''}`;
 }
 if (goldenRays) goldenRays.style.opacity = '0';
 if (stormCloud) stormCloud.style.opacity = '1';

 if (calloutEl && calloutEmoji && calloutText) {
 calloutEl.style.display = 'flex';
 calloutEmoji.textContent = isBurnt ? '🔥' : '🤢';
 calloutText.textContent = isBurnt ? 'DISASTER! BURNT ASH! (0/10)' : 'GAG! COMPLETE DISASTER! (0/10)';
 }

 if (speech) speech.style.display = 'inline-flex';
 if (speechAvatar) speechAvatar.textContent = 'CHEF';
 if (malQuoteEl) malQuoteEl.textContent = `"${roast.mal}"`;
 if (translitQuoteEl) translitQuoteEl.textContent = `"${roast.trans}"`;
 if (engQuoteEl) engQuoteEl.textContent = `"${roast.eng}"`;

 if (window.soundEngine) {
 window.soundEngine.playSteamHiss();
 window.soundEngine.playGagCough();
 window.soundEngine.playFailBuzzer();
 window.soundEngine.playHorn();
 }
 this.triggerScreenShake();

 setTimeout(() => {
 this.showResultModal(false, 'REJECTED BY STRICT CHEF!', roast);
 }, 2500);
 }

 }, 2400);
 }

 /* =========================================================================
 ENDSCREEN MODAL LOGIC WITH MALAYALAM MEME CALLOUT
 ========================================================================= */
 showResultModal(isWin, title, roastObj) {
    this.lastIsWin = isWin;
 if (!this.resultModal) return;
 this.resultModal.classList.add('active');
    if (this.resultCard) this.resultCard.scrollTop = 0;

 if (this.resultCard) {
 if (isWin) this.resultCard.classList.add('verdict-win');
 else this.resultCard.classList.remove('verdict-win');
 }

 if (this.resultStamp) {
 this.resultStamp.className = `ad-result-stamp ${isWin ? 'stamp-win' : 'stamp-fail'}`;
 this.resultStamp.textContent = isWin ? 'PRO CHEF!' : 'REJECTED!';
 }
 if (this.resultHeadline) this.resultHeadline.textContent = title;

 if (this.verdictMalayalamMain && roastObj) {
 this.verdictMalayalamMain.textContent = `"${roastObj.mal}"`;
 }
 if (this.verdictTranslitSub) {
 this.verdictTranslitSub.style.display = 'none';
 }
 if (this.resultDesc && roastObj) {
 this.resultDesc.textContent = roastObj.eng;
 }

 if (this.resultRewardVal) {
 this.resultRewardVal.textContent = isWin ? '+2,500 COINS' : '+0 COINS';
 }
 if (this.btnRetry) this.btnRetry.style.display = isWin ? 'none' : 'flex';
 if (this.btnNextLevel) this.btnNextLevel.style.display = isWin ? 'flex' : 'none';
 if (isWin) {
 this.addCoins(2500);
 }
 }

 hideResultModal() {
 if (this.resultModal) this.resultModal.classList.remove('active');
 }

  showJudgesReviewModal() {
    const modal = document.getElementById('judges-review-modal');
    if (!modal) return;

    const isWin = !!this.lastIsWin;
    const scoreGR = document.getElementById('score-gordon');
    const quoteGR = document.getElementById('quote-gordon');
    const scoreCA = document.getElementById('score-antonio');
    const quoteCA = document.getElementById('quote-antonio');
    const scoreAE = document.getElementById('score-ego');
    const quoteAE = document.getElementById('quote-ego');
    const rankBadge = document.getElementById('judge-rank-badge');
    const dishTitle = document.getElementById('judge-dish-title');

    if (dishTitle) dishTitle.textContent = 'Gourmet Double Smash Burger';

    if (isWin) {
      if (rankBadge) {
        rankBadge.className = 'judge-trophy-badge';
        rankBadge.style.background = 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)';
        rankBadge.style.color = '#000000';
        rankBadge.textContent = '🏆 MASTERCHEF GRAND CHAMPION (10/10)';
      }
      if (scoreGR) scoreGR.textContent = '10/10';
      if (quoteGR) quoteGR.textContent = '"Stunning sear! Perfectly balanced heat and restaurant quality crust!"';
      if (scoreCA) scoreCA.textContent = '10/10';
      if (quoteCA) quoteCA.textContent = '"Mamma mia! The aroma of herbs and melted butter is singing like an opera!"';
      if (scoreAE) scoreAE.textContent = '9.8/10';
      if (quoteAE) quoteAE.textContent = '"A sublime symphony of textures and harmonic plating. Truly inspired."';
    } else {
      if (rankBadge) {
        rankBadge.className = 'judge-trophy-badge';
        rankBadge.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
        rankBadge.style.color = '#ffffff';
        rankBadge.textContent = '💀 ELIMINATED BY THE PANEL (0/10)';
      }
      if (scoreGR) scoreGR.textContent = '1/10';
      if (quoteGR) quoteGR.textContent = '"You donkey! It is totally inedible! What an absolute culinary disaster!"';
      if (scoreCA) scoreCA.textContent = '0/10';
      if (quoteCA) quoteCA.textContent = '"Che disastro! Even the pigeons in Piazza San Marco would fly away!"';
      if (scoreAE) scoreAE.textContent = '1/10';
      if (quoteAE) quoteAE.textContent = '"A profound insult to gastronomy. I would not feed this to my worst enemy."';
    }

    modal.classList.add('active');
  }

 /* =========================================================================
 FX & POPUPS
 ========================================================================= */
 showFloatingPopup(text, x, y, color = '#facc15') {
 const container = document.getElementById('ad-floating-popups');
 if (!container) return;

 const el = document.createElement('div');
 el.className = 'floating-popup';
 el.textContent = text;
 el.style.left = `${Math.min(window.innerWidth - 180, Math.max(20, x - 100))}px`;
 el.style.top = `${y}px`;
 if (color) el.style.color = color;
 container.appendChild(el);

 setTimeout(() =>{
 if (el.parentElement) el.parentElement.removeChild(el);
 }, 1200);
 }

 triggerScreenShake() {
 const viewport = document.getElementById('mobile-game-viewport');
 if (!viewport) return;
 viewport.classList.remove('shake-screen');
 void viewport.offsetWidth;
 viewport.classList.add('shake-screen');
 }

 addCoins(amount) {
 this.coins += amount;
 this.updateStats();
 }

 updateStats() {
 if (this.coinDisplay) this.coinDisplay.textContent = this.coins.toLocaleString();
 if (this.comboDisplay) this.comboDisplay.textContent = `x${this.combo} COMBO`;
 if (this.starDisplay) this.starDisplay.textContent = '*'.repeat(this.stars);
 }

 /* =========================================================================
 5. 3D RENDER LOOP & CAMERA DIRECTOR
 ========================================================================= */
 startLoop() {
 const loop = (time) =>{
 const dt = Math.min((time - this.lastTime) / 1000, 0.1);
 this.lastTime = time;

 this.update3D(dt);
 this.render3D();

 this.animFrameId = requestAnimationFrame(loop);
 };
 this.animFrameId = requestAnimationFrame(loop);
 }

 update3D(dt) {
 // 3D Camera Director Lerping
 const targetStation = this.cameraStations[this.stage] || this.cameraStations[1];

 if (this.stage === 4) {
 this.orbitAngle += dt * 0.45;
 const radius = 3.2;
 const targetPos = new THREE.Vector3(
 4.2 + Math.sin(this.orbitAngle) * radius,
 2.4,
 Math.cos(this.orbitAngle) * radius
 );
 this.currentCamPos.lerp(targetPos, 0.08);
 this.currentCamLook.lerp(this.cameraStations[4].lookAt, 0.1);
 } else {
 this.currentCamPos.lerp(targetStation.pos, 0.08);
 this.currentCamLook.lerp(targetStation.lookAt, 0.08);
 }

 this.camera.position.copy(this.currentCamPos);
 this.camera.lookAt(this.currentCamLook);

 // Stage 1: 3D Knife Chop Animation
 if (this.knifeChopTimer >0) {
 this.knifeChopTimer -= dt;
 this.knifeGroup.position.y = 0.85 + Math.sin(this.knifeChopTimer * 20) * 0.4;
 this.knifeGroup.rotation.z = -0.05;
 } else {
 this.knifeGroup.position.y = 1.35;
 this.knifeGroup.rotation.z = -0.3;
 }

 // Stage 1: 3D Flying Vegetable Slices
 for (let i = this.flyingSlices.length - 1; i >= 0; i--) {
 const s = this.flyingSlices[i];
 s.mesh.position.x += s.vx * dt;
 s.mesh.position.y += s.vy * dt;
 s.mesh.position.z += s.vz * dt;
 s.vy -= 9.8 * dt; // gravity
 s.mesh.rotation.x += s.rx * dt;
 s.mesh.rotation.y += s.ry * dt;
 s.life -= dt;
 if (s.life <= 0) {
 this.scene.remove(s.mesh);
 this.flyingSlices.splice(i, 1);
 }
 }

 // Stage 2: Oscillating Needle
 if (this.stage === 2 && !this.pattyFlipped) {
 this.needlePos += this.needleSpeed * this.needleDirection * dt;
 if (this.needlePos >= 100) {
 this.needlePos = 100;
 this.needleDirection = -1;
 } else if (this.needlePos <= 0) {
 this.needlePos = 0;
 this.needleDirection = 1;
 }
 if (this.timingNeedleEl) {
 this.timingNeedleEl.style.left = `${this.needlePos}%`;
 }
 }

 // Stage 2: 3D Patty Backflip Animation
 if (this.stage === 2 && this.pattyFlipped) {
 this.pattyMesh3D.position.y += this.pattyVy * dt;
 this.pattyVy -= 14 * dt; // gravity
 this.pattyMesh3D.rotation.x += Math.PI * 3.5 * dt;

 if (this.pattyMesh3D.position.y <= 0.38) {
 this.pattyMesh3D.position.y = 0.38;
 this.pattyMesh3D.rotation.x = Math.PI; // Flipped over
 }
 }

 // Stage 2: 3D Steam Particles rise & reset
 if (this.steamGroup) {
 this.steamGroup.children.forEach(p =>{
 p.position.y += dt * 0.8;
 if (p.position.y >2.8) {
 p.position.y = 0.5;
 p.position.x = (Math.random() - 0.5) * 1.4;
 p.position.z = (Math.random() - 0.5) * 1.4;
 }
 });
 }

 // Stage 3: 3D Spatula Crane Swinging
 if (this.stage === 3 && !this.falling3DItem && !this.isToppled) {
 this.spatulaX += this.spatulaSpeed * this.spatulaDir * dt;
 if (this.spatulaX >= 1.5) {
 this.spatulaX = 1.5;
 this.spatulaDir = -1;
 } else if (this.spatulaX <= -1.5) {
 this.spatulaX = -1.5;
 this.spatulaDir = 1;
 }
 this.spatulaCrane3D.position.x = this.spatulaX;

 // Update Aiming Projection Ring & Laser Color
 if (this.targetRingMesh && this.laserMat) {
 this.targetRingMesh.position.x = this.spatulaX;
 const offset = Math.abs(this.spatulaX);
 if (offset < 0.25) {
 this.laserMat.color.setHex(0x10b981); // Emerald Green
 this.targetRingMat.color.setHex(0x10b981);
 } else if (offset < 0.65) {
 this.laserMat.color.setHex(0xfacc15); // Yellow
 this.targetRingMat.color.setHex(0xfacc15);
 } else {
 this.laserMat.color.setHex(0xef4444); // Red Danger
 this.targetRingMat.color.setHex(0xef4444);
 }
 }
 }

 // Stage 3: 3D Falling Item Physics
 if (this.falling3DItem) {
 this.falling3DItem.vy += 12 * dt;
 this.falling3DItem.y -= this.falling3DItem.vy * dt;
 this.falling3DItem.mesh.position.y = this.falling3DItem.y;

 if (this.falling3DItem.y <= this.falling3DItem.targetY) {
 this.falling3DItem.mesh.position.y = this.falling3DItem.targetY;
 this.on3DLayerLanded();
 }
 }

 // Stage 3: Burger Stack Wobble Tilt
 if (this.stage === 3 && this.burgerStackGroup3D) {
 const targetTilt = this.tiltOffset * 0.08;
 this.burgerStackGroup3D.rotation.z = THREE.MathUtils.lerp(
 this.burgerStackGroup3D.rotation.z,
 targetTilt,
 0.1
 );
 }
 }

 render3D() {
 if (this.renderer && this.scene && this.camera) {
 this.renderer.render(this.scene, this.camera);
 }
 }
}

// Global Export for app.js coordinator
window.MobileAdCookingGame = MobileAdCookingGame3D;
window.PlayableCookingGame = MobileAdCookingGame3D;
