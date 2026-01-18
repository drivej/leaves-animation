export class Twister {
    constructor(a: any);
    position: {
        x: number;
        y: number;
    };
    center: {
        x: number;
        y: number;
    };
    crawl: {
        x: number;
        y: number;
    };
    trail: any[];
    data: {};
    onEnterFrame: () => void;
    data_array: any;
    _rad: number;
    _alive: boolean;
    render(): {
        x: number;
        y: number;
    };
    die(): void;
    get alive(): boolean;
}
//# sourceMappingURL=twister.d.ts.map