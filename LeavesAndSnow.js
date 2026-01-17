import { Snowflake } from './Snowflake.js';
import { Leaf } from './Leaf.js';
import { Pointer } from './Pointer.js';

export class LeavesAndSnow {
  constructor() {
    this.pointer = new Pointer();
    this.elements = [];
    this.world = { vector: { x: 1, y: 0.3 } };
    this.app = new PIXI.Application();

    // Bind methods once so we can remove event listeners later
    this.boundOnTick = this.onTick.bind(this);
    this.boundOnResize = this.onResize.bind(this);

    this.init();
  }

  async init() {
    await this.app.init({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      // PERFORMANCE: Prefer WebGL for better performance
      preference: 'webgl'
    });

    // Append canvas to DOM after init completes
    document.body.appendChild(this.app.canvas);

    // PERFORMANCE: Only enable if you need dynamic zIndex changes
    // Sorting 200+ children every frame is expensive
    this.app.stage.sortableChildren = true;

    const bg_img = await PIXI.Assets.load('assets/autumn_sky.png');
    this.bg = new PIXI.Sprite(bg_img);
    this.bg.brightness_a = 0;
    this.bg.width = this.app.screen.width;
    this.bg.height = this.app.screen.height;
    this.bg.zIndex = -1;
    this.app.stage.addChild(this.bg);

    const girl_img = await PIXI.Assets.load('assets/fall_woman.png');
    this.girl = new PIXI.Sprite(girl_img);
    this.girl.brightness_a = 0;
    this.girl.anchor.set(0.5, 1);
    this.girl.y = this.app.screen.height;
    this.girl.x = this.app.screen.width * 0.5;
    this.girl.scale.set(1);
    this.girl.zIndex = 150;
    this.girl.tint = 0xAAAAAA;
    this.app.stage.addChild(this.girl);

    // PERFORMANCE TIP: For even better performance with many particles,
    // consider using PIXI.ParticleContainer instead of adding to stage directly
    // const particleContainer = new PIXI.ParticleContainer(500, {
    //   scale: true, position: true, rotation: true, alpha: true, tint: true
    // });
    // this.app.stage.addChild(particleContainer);

    this.app.ticker.add(this.boundOnTick);

    window.addEventListener('resize', this.boundOnResize);
    window.dispatchEvent(new Event('resize'));
  }

  onResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.bg.width = this.app.screen.width;
    this.bg.height = this.app.screen.height;

    // Position girl horizontally centered

    // Fit the girl to 70% of screen height
    this.girl.scale.set((this.app.screen.height * 0.7) / this.girl.texture.height);

    // Position girl vertically - anchor.y = 1 means bottom of sprite is at this y position
    // To position "below the fold a bit", add some offset (e.g., 10% of screen height)
    this.girl.x = this.app.screen.width * 0.5;
    this.girl.y = this.app.screen.height + (this.app.screen.height * 0.1);
  }

  onTick(ticker) {
    if (this.elements.length < 200) {
      if (Math.random() < 0.2) {
        this.addLeaf();
      }
      if (Math.random() < 0.7) {
        this.addSnowflake();
      }
    }
    // Animate leaves
    this.world.vector.x = this.pointer.offsetNormalized.x * 5; // -10,10
    this.world.vector.y = 1 + this.pointer.positionNormalized.y * 2; // -1, 1

    let i = this.elements.length;

    while (i--) {
      const el = this.elements[i];

      if (el.y > this.app.screen.height + el.height) {
        this.removeElement(el);
      } else {
        el.onTick(ticker, this.world);
      }
    }
  }

  addLeaf() {
    const leaf = new Leaf(this.app);
    this.elements.push(leaf);
    this.app.stage.addChild(leaf);
  }

  addSnowflake() {
    const snowflake = new Snowflake(this.app);
    this.elements.push(snowflake);
    this.app.stage.addChild(snowflake);
  }

  removeElement(element) {
    this.elements.splice(this.elements.indexOf(element), 1);
    this.app.stage.removeChild(element);
    element.destroy();
  }

  destroy() {
    // Clean up all elements
    while (this.elements.length > 0) {
      const el = this.elements.pop();
      this.app.stage.removeChild(el);
      el.destroy();
    }

    // Remove resize listener
    window.removeEventListener('resize', this.boundOnResize);

    // Remove canvas from DOM
    if (this.app.canvas && this.app.canvas.parentNode) {
      this.app.canvas.parentNode.removeChild(this.app.canvas);
    }

    // Destroy the PixiJS app (this also stops the ticker)
    this.app.destroy(true, { children: true, texture: false, baseTexture: false });

    // Clean up pointer (if it has cleanup needed)
    // Note: Pointer event listeners will persist, but that's okay for a singleton
  }
}
