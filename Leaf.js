import { randomFloat, randomGears, tickGears, RAD, lerpColor, lerp } from './utils.js';

const texture_leaf = await PIXI.Assets.load('assets/leaf.png');

export class Leaf extends PIXI.Sprite {
  TINTS = [0xff33cc, 0x88ddcc, 0xffff33];

  // Atmospheric perspective color (sky blue)
  static SKY_TINT = 0xaaccff;

  constructor(app) {
    super(texture_leaf);
    this.anchor.set(0.5);
    this.scale.set(1);
    this.x = randomFloat(-500, app.screen.width + 500);
    this.y = texture_leaf.height * -10;

    // Store original tint for depth calculation
    const baseTint = this.TINTS[Math.floor(Math.random() * this.TINTS.length)];
    //this.originalTint = this.TINTS[Math.floor(Math.random() * this.TINTS.length)];

    this.tint = lerpColor(baseTint, 0xffffff, randomFloat(0, 1));

    const z = ~~randomFloat(0, 300);
    const minScale = 0.5;
    const maxScale = 2;
    const baseScale = lerp(minScale, maxScale, z / 300);

    this.anim = {
      time: 0,
      baseX: this.x,
      baseY: this.y,
      gears: randomGears(),
      baseScale,
      z, // Depth value (0 = far, 300 = near, girl at 100)
      spinX: { speed: randomFloat(-2, 2), angle: randomFloat(0, 360) },
      spinY: { speed: randomFloat(-2, 2), angle: randomFloat(0, 360) },
      vector: {
        x: randomFloat(-2, 2),
        y: 0
      }
    };

    // PERFORMANCE: Blur filters are very expensive! Only use for a few elements
    // this.filters = [new PIXI.BlurFilter({ strength: Math.abs(4 - this.anim.baseScale) })];

    // Apply depth-based tint (atmospheric perspective)
    // this.updateDepthTint();

    this.zIndex = this.anim.z;
  }

  // updateDepthTint() {
  //   // Atmospheric perspective: far objects are more blue and desaturated
  //   // z range: 0.5 (far) to 3 (near)
  //   // Normalize z to 0-1 range (0 = far, 1 = near)
  //   // const zNormalized = (this.anim.z - 0.5) / (3 - 0.5);

  //   // Interpolate from sky color (far) to original color (near)
  //   // When z is low (far): more sky color
  //   // When z is high (near): more original color
  //   // this.tint = lerpColor(Leaf.SKY_TINT, this.originalTint, zNormalized);
  //   this.tint = this.originalTint;
  // }

  onTick(ticker, world) {
    const p = tickGears(this.anim.gears);

    this.anim.baseX += world.vector.x * this.anim.baseScale;
    this.anim.baseY += world.vector.y * this.anim.baseScale;

    this.x = p.x + this.anim.baseX;
    this.y = p.y + this.anim.baseY;

    // Simulate 3D rotation using scale
    this.anim.spinY.angle += this.anim.spinY.speed + world.vector.x * 0.5;
    this.rotation = this.anim.spinY.angle * RAD;

    this.anim.spinX.angle += this.anim.spinX.speed + world.vector.x * 0.5;
    this.scale.x = this.anim.baseScale * Math.cos(this.anim.spinX.angle * RAD);

    this.scale.y = this.anim.baseScale;
  }
}
