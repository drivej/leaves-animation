export class LeavesAndSnow {
    constructor(options?: {});
    options: {};
    width: any;
    height: any;
    container: any;
    pointer: Pointer;
    elements: any[];
    world: {
        vector: {
            x: number;
            y: number;
        };
    };
    app: PIXI.Application<PIXI.Renderer>;
    initialized: boolean;
    boundOnTick: (ticker: any) => void;
    boundOnResize: () => void;
    initPromise: Promise<void>;
    init(): Promise<void>;
    bg: PIXI.Sprite | undefined;
    girl: PIXI.Sprite | undefined;
    onResize(): void;
    positionGirl(): void;
    onTick(ticker: any): void;
    addLeaf(): void;
    addSnowflake(): void;
    removeElement(element: any): void;
    destroy(): Promise<void>;
}
import { Pointer } from './Pointer.js';
import * as PIXI from 'pixi.js';
//# sourceMappingURL=LeavesAndSnow.d.ts.map