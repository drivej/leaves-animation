export class Snowflake extends PIXI.Graphics {
    static SKY_TINT: number;
    constructor(app: any);
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
        spinSpeed: any;
        flipSpeed: any;
        flipAmount: any;
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
    init(): void;
    onTick(ticker: any, world: any): void;
}
import * as PIXI from 'pixi.js';
//# sourceMappingURL=Snowflake.d.ts.map