export class Leaf extends PIXI.Sprite {
    constructor(app: any);
    TINTS: number[];
    x: any;
    anim: {
        time: number;
        baseX: any;
        baseY: number;
        gears: {
            r: any;
            a: any;
            s: any;
        }[];
        baseScale: any;
        z: number;
        spinX: {
            speed: any;
            angle: any;
        };
        spinY: {
            speed: any;
            angle: any;
        };
        vector: {
            x: any;
            y: number;
        };
    };
    onTick(ticker: any, world: any): void;
}
import * as PIXI from 'pixi.js';
//# sourceMappingURL=Leaf.d.ts.map