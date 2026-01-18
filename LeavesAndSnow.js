import * as PIXI from 'pixi.js';
import { Snowflake } from './Snowflake.js';
import { Leaf } from './Leaf.js';
import { Pointer } from './Pointer.js';
import autumnSkyImg from './assets/autumn_sky.png';
import fallWomanImg from './assets/fall_woman.png';

export class LeavesAndSnow {
  constructor(options = {}) {
    const { width, height, container } = options;

    this.options = options;
    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;
    this.container = container;
    this.pointer = new Pointer();
    this.elements = [];
    this.world = { vector: { x: 1, y: 0.3 } };
    this.app = new PIXI.Application();
    this.initialized = false;

    this.boundOnTick = this.onTick.bind(this);
    this.boundOnResize = this.onResize.bind(this);

    this.initPromise = this.init();
  }

  async init() {
    await this.app.init({
      width: this.width,
      height: this.height,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      preference: 'webgl'
    });

    const targetContainer = this.container || document.body;
    targetContainer.appendChild(this.app.canvas);

    this.app.stage.sortableChildren = true;

    const bg_img = await PIXI.Assets.load(autumnSkyImg);
    this.bg = new PIXI.Sprite(bg_img);
    this.bg.brightness_a = 0;
    this.bg.width = this.app.screen.width;
    this.bg.height = this.app.screen.height;
    this.bg.zIndex = -1;
    this.app.stage.addChild(this.bg);

    const girl_img = await PIXI.Assets.load(fallWomanImg);
    this.girl = new PIXI.Sprite(girl_img);
    this.girl.brightness_a = 0;
    this.girl.anchor.set(0.5, 1);
    this.girl.y = this.app.screen.height;
    this.girl.x = this.app.screen.width * 0.5;
    this.girl.scale.set(1);
    this.girl.zIndex = 150;
    this.girl.tint = 0xAAAAAA;
    this.app.stage.addChild(this.girl);

    this.app.ticker.add(this.boundOnTick);

    if (!this.options.width || !this.options.height) {
      window.addEventListener('resize', this.boundOnResize);
      window.dispatchEvent(new Event('resize'));
    } else {
      this.positionGirl();
    }

    this.initialized = true;
  }

  onResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.bg.width = this.app.screen.width;
    this.bg.height = this.app.screen.height;
    this.positionGirl();
  }

  positionGirl() {
    this.girl.scale.set((this.app.screen.height * 0.7) / this.girl.texture.height);
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

    this.world.vector.x = this.pointer.offsetNormalized.x * 5;
    this.world.vector.y = 1 + this.pointer.positionNormalized.y * 2;

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

  async destroy() {
    if (this.initPromise) {
      try {
        await this.initPromise;
      } catch (err) {
        console.error('Error during initialization:', err);
      }
    }

    if (!this.initialized) {
      return;
    }

    if (this.app && this.app.stage) {
      while (this.elements.length > 0) {
        const el = this.elements.pop();
        this.app.stage.removeChild(el);
        el.destroy();
      }
    }

    if (this.boundOnResize) {
      window.removeEventListener('resize', this.boundOnResize);
    }

    if (this.app && this.app.canvas && this.app.canvas.parentNode) {
      this.app.canvas.parentNode.removeChild(this.app.canvas);
    }

    if (this.app) {
      this.app.destroy(true, { children: true, texture: false, baseTexture: false });
    }

    this.initialized = false;
  }
}
