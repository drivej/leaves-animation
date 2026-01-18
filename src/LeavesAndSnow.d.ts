import * as PIXI from 'pixi.js';

export interface LeavesAndSnowOptions {
  width?: number;
  height?: number;
  container?: HTMLElement;
}

export class LeavesAndSnow {
  constructor(options?: LeavesAndSnowOptions);

  pointer: any;
  elements: any[];
  world: { vector: { x: number; y: number } };
  app: PIXI.Application;
  bg: PIXI.Sprite;
  girl: PIXI.Sprite;
  width: number;
  height: number;
  container?: HTMLElement;

  init(): Promise<void>;
  onResize(): void;
  positionGirl(): void;
  onTick(ticker: PIXI.Ticker): void;
  addLeaf(): void;
  addSnowflake(): void;
  removeElement(element: any): void;
  destroy(): void;
}
