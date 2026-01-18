import * as PIXI from 'pixi.js';
import { randomFloat, randomGears, tickGears, RAD, lerpColor, lerp } from './utils.js';
import leafImg from './assets/leaf.png';

const texture_leaf = await PIXI.Assets.load(leafImg);

export class Leaf extends PIXI.Sprite {
  TINTS = [0xff33cc, 0x88ddcc, 0xffff33];

  constructor(app) {
    super(texture_leaf);
    this.anchor.set(0.5);
    this.scale.set(1);
    this.x = randomFloat(-500, app.screen.width + 500);
    this.y = texture_leaf.height * -10;

    const baseTint = this.TINTS[Math.floor(Math.random() * this.TINTS.length)];
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
      z,
      spinX: { speed: randomFloat(-2, 2), angle: randomFloat(0, 360) },
      spinY: { speed: randomFloat(-2, 2), angle: randomFloat(0, 360) },
      vector: {
        x: randomFloat(-2, 2),
        y: 0
      }
    };

    this.zIndex = this.anim.z;
  }

  onTick(ticker, world) {
    const p = tickGears(this.anim.gears);

    this.anim.baseX += world.vector.x * this.anim.baseScale;
    this.anim.baseY += world.vector.y * this.anim.baseScale;

    this.x = p.x + this.anim.baseX;
    this.y = p.y + this.anim.baseY;

    this.anim.spinY.angle += this.anim.spinY.speed + world.vector.x * 0.5;
    this.rotation = this.anim.spinY.angle * RAD;

    this.anim.spinX.angle += this.anim.spinX.speed + world.vector.x * 0.5;
    this.scale.x = this.anim.baseScale * Math.cos(this.anim.spinX.angle * RAD);

    this.scale.y = this.anim.baseScale;
  }
}
