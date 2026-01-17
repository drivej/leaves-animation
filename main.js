import { Twister } from './twister.js';

const app = new PIXI.Application();

await app.init({
  resizeTo: window,
  backgroundAlpha: 0,
  antialias: true,
  autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2)
});
document.body.appendChild(app.canvas);

const ribbon = new PIXI.Graphics();
app.stage.addChild(ribbon);

const texture_leaf = await PIXI.Assets.load('leaf.png');

const Leaves = [];
const world = { wind: { x: 1, y: 0.3 } };
const TINTS = [0xff33cc, 0x88ddcc, 0xffff33];

function randomFloat(n1, n2) {
  return Math.random() * (n2 - n1) + n1;
}

function randomGear(maxRadius = 100) {
  return {
    r: randomFloat(maxRadius * 0.2, maxRadius),
    a: randomFloat(0, Math.PI * 2),
    s: randomFloat(-0.05, 0.05)
  };
}

function randomGears(maxGears = 4, maxRadius = 100) {
  const n = Math.floor(randomFloat(2, maxGears));
  const gears = [];
  for (let i = 0; i < n; i++) {
    gears.push(randomGear(maxRadius));
  }
  return gears;
}

function tickGears(gears) {
  const p = { x: 0, y: 0 };
  for (const g of gears) {
    g.a += g.s;
    p.x += Math.cos(g.a) * g.r;
    p.y += Math.sin(g.a) * g.r;
  }
  return p;
}

class Snowflake extends PIXI.Graphics {
  constructor() {
    super();
    this.init();
    this.scale.set(1);
    this.x = randomFloat(-500, app.screen.width + 500);
    this.y = -50;
    this.anim = {
      time: 0,
      baseX: this.x,
      baseY: this.y,
      vector: {
        x: randomFloat(-1, 1),
        y: randomFloat(1, 2)
      },
      gears: randomGears(2, 20),
      baseScale: randomFloat(0.5, 2),
      spinSpeed: randomFloat(-0.01, 0.01),
      flipSpeed: randomFloat(0.5, 1),
      flipAmount: randomFloat(0.2, 0.4)
    };
    //this.tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    this.filters = [new PIXI.BlurFilter({ strength: Math.abs(4 - this.anim.baseScale) })];
    this.zIndex = this.anim.baseScale;
    Leaves.push(this);
  }

  init() {
    const radiusX = 10; //randomFloat(10, 20);
    const radiusY = 10; //randomFloat(10, 20);
    const smoothness = 5; //randomFloat(10, 20);
    const color = 0xffffff;

    this.beginFill(color);

    const points = [];
    const numPoints = smoothness; // Higher number = smoother blob
    const angleIncrement = (Math.PI * 2) / numPoints;
    const randomFactor = 1; // How irregular the blob is (0 = perfect oval, 1 = very chaotic)

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleIncrement;
      // Generate a random perturbation for the radius
      const randX = Math.random() * randomFactor - randomFactor / 2;
      const randY = Math.random() * randomFactor - randomFactor / 2;

      // Calculate the actual radius at this angle
      const currentRadiusX = radiusX * (1 + randX);
      const currentRadiusY = radiusY * (1 + randY);

      // Convert polar coordinates (angle, radius) to Cartesian coordinates (x, y)
      const x = Math.cos(angle) * currentRadiusX;
      const y = Math.sin(angle) * currentRadiusY;

      points.push(new PIXI.Point(x, y));
    }

    // Draw the shape using the generated points
    this.drawPolygon(points);
    this.endFill();

    // Position the blob in the center of the screen/container
    //graphics.x = app.screen.width / 2;
    //graphics.y = app.screen.height / 2;
  }
}

class Leaf extends PIXI.Sprite {
  constructor() {
    super(texture_leaf);
    this.anchor.set(0.5);
    this.scale.set(1);
    this.x = randomFloat(-500, app.screen.width + 500);
    this.y = -500;
    this.anim = {
      time: 0,
      baseX: this.x,
      baseY: this.y,
      gears: randomGears(),
      baseScale: randomFloat(1, 12),
      spinSpeed: randomFloat(-0.02, 0.02),
      flipSpeed: randomFloat(1, 3),
      flipAmount: randomFloat(0.4, 0.6)
    };
    this.tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    this.filters = [new PIXI.BlurFilter({ strength: Math.abs(4 - this.anim.baseScale) })];
    this.zIndex = this.anim.baseScale;
    Leaves.push(this);
  }
}

setInterval(() => {
  if (Math.random() < 0.733 && Leaves.length < 200) {
    app.stage.addChild(new Leaf());
    app.stage.addChild(new Snowflake());
  }
}, 200);

// Feel-first tuning knobs
const FEEL = {
  pointerFollow: 0.22, // 0..1 (higher = snappier)
  trailLength: 42, // we can exceed Twister's internal 30 by interpolation (kept separate)
  ribbonWidth: 18, // head width
  ribbonTailWidth: 2, // tail width
  minMoveToRecord: 0.3 // ignore tiny jitter
};

// Twister segments (tune freely)
const segments = Array.from({ length: 18 }, (_, i) => ({
  radius: 10 + i * 1.2,
  speed: (i % 2 === 0 ? 1 : -1) * (6 + i * 0.15),
  scalar: 0.987 // closer to 1 = longer-lived swirl
}));

const twister = new Twister(segments);

// Track pointer
const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
window.addEventListener('pointermove', (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;

  world.wind.x = ((e.clientX - app.screen.width / 2) / app.screen.width) * 4;
  //world.wind.y = 1 + ((e.clientY/app.screen.height) * 1);
});

// Smooth center follow
twister.center.x = pointer.x;
twister.center.y = pointer.y;

twister.onEnterFrame = (t) => {
  t.center.x += (pointer.x - t.center.x) * FEEL.pointerFollow;
  t.center.y += (pointer.y - t.center.y) * FEEL.pointerFollow;
};

// Helpers
function dist(a, b) {
  const dx = a.x - b.x,
    dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Build a “ribbon” polygon around a polyline trail
function drawRibbon(g, pts) {
  if (pts.length < 2) return;

  const left = [];
  const right = [];

  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const pPrev = pts[Math.max(0, i - 1)];
    const pNext = pts[Math.min(n - 1, i + 1)];

    // Tangent
    const tx = pNext.x - pPrev.x;
    const ty = pNext.y - pPrev.y;
    const len = Math.hypot(tx, ty) || 1;

    // Normal
    const nx = -ty / len;
    const ny = tx / len;

    const t = i / (n - 1);
    const w = FEEL.ribbonWidth * (1 - t) + FEEL.ribbonTailWidth * t;

    left.push({ x: p.x + nx * w * 0.5, y: p.y + ny * w * 0.5 });
    right.push({ x: p.x - nx * w * 0.5, y: p.y - ny * w * 0.5 });
  }

  g.beginFill(0xffffff, 0.9);

  g.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < left.length; i++) g.lineTo(left[i].x, left[i].y);
  for (let i = right.length - 1; i >= 0; i--) g.lineTo(right[i].x, right[i].y);

  g.closePath();
  g.endFill();
}

let lastRecorded = { x: twister.center.x, y: twister.center.y };

app.ticker.add(() => {
  if (twister.alive) {
    twister.render();

    // Copy twister.trail but optionally reject micro jitter
    const raw = twister.trail;
    if (raw.length === 0) return;

    if (dist(raw[0], lastRecorded) > FEEL.minMoveToRecord) {
      lastRecorded = { x: raw[0].x, y: raw[0].y };
    } else {
      // overwrite newest with lastRecorded to reduce tiny wiggle
      raw[0] = lastRecorded;
    }

    // Draw
    ribbon.clear();
    drawRibbon(ribbon, raw);
  }

  // Animate leaves

  let i = Leaves.length;
  while (i--) {
    //for (let i = els.length - 1; i >= 0; i--) {
    try {
      const el = Leaves[i];
      if (!el?.x) continue;

      const p = tickGears(el.anim.gears);
      el.anim.baseX += world.wind.x * el.anim.baseScale;
      el.anim.baseY += world.wind.y * el.anim.baseScale;
      el.x = el.anim.baseX + p.x;
      el.y = el.anim.baseY + p.y;

      // Animate leaf floating in wind
      el.anim.time += 0.016; // ~60fps
      /*

    // Drift across screen
    leaf.anim.baseX += leaf.anim.driftSpeedX;
    leaf.anim.baseY += leaf.anim.driftSpeedY;

    leaf.anim.baseX += world.wind.x * leaf.anim.baseScale;
    leaf.anim.baseY += world.wind.y * leaf.anim.baseScale;
*/
      // Remove leaf if it goes off the right side
      if (el.anim.baseX > app.screen.width + 500 || el.anim.baseY > app.screen.height + 500) {
        app.stage.removeChild(el);
        Leaves.splice(i, 1);
        el.destroy();
        continue;
      }
      /*
    // Wrap around bottom edge
    if (leaf.anim.baseY > app.screen.height + 50) leaf.anim.baseY = -50;

    // Wobble motion
    const wobbleX = Math.sin(leaf.anim.time * leaf.anim.wobbleSpeed) * leaf.anim.wobbleAmount;
    const wobbleY = Math.cos(leaf.anim.time * leaf.anim.wobbleSpeed * 0.7) * leaf.anim.wobbleAmount * 0.5;

    leaf.x = leaf.anim.baseX + wobbleX;
    leaf.y = leaf.anim.baseY + wobbleY;
    */

      // Spinning rotation
      el.rotation += el.anim.spinSpeed;

      // Flipping effect (scale.x oscillation)
      el.scale.x = el.anim.baseScale * 0.4 * Math.cos(el.anim.time * el.anim.flipSpeed) * el.anim.flipAmount;
      el.scale.y = el.anim.baseScale * 0.4;
    } catch (e) {
      console.log({ i, el });
      console.log('error', e);
    }
  }
});
