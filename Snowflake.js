import { randomFloat, randomGears, tickGears, lerpColor, lerp, RAD } from './utils.js';

export class Snowflake extends PIXI.Graphics {
  // Atmospheric perspective color (sky blue)
  static SKY_TINT = 0x99cccff;

  constructor(app) {
    super();
    this.init();
    this.scale.set(1);
    this.x = randomFloat(-500, app.screen.width + 500);
    this.y = -50;

    // Store original tint for depth calculation
    this.originalTint = 0xffffff;

    const z = ~~randomFloat(0, 300);
    const minScale = 0.5;
    const maxScale = 2;
    const baseScale = lerp(minScale, maxScale, z / 300);

    this.tint = lerpColor(Snowflake.SKY_TINT, 0xffffff, z / 300);

    this.anim = {
      time: 0,
      baseX: this.x,
      baseY: this.y,
      gears: randomGears(),
      baseScale,
      z, // Depth value (0 = far, 300 = near, girl at 100)
      spinSpeed: randomFloat(-0.01, 0.01),
      flipSpeed: randomFloat(0.5, 1),
      flipAmount: randomFloat(0.2, 0.4),
      spinX: { speed: randomFloat(-2, 2), angle: randomFloat(0, 360) },
      spinY: { speed: randomFloat(-2, 2), angle: randomFloat(0, 360) },
      vector: {
        x: randomFloat(-2, 2),
        y: 0
      }
    };

    this.zIndex = this.anim.z;
  }

  init() {
    const radiusX = 5; //randomFloat(10, 20);
    const radiusY = 5; //randomFloat(10, 20);
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
