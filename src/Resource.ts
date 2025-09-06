/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

export class Ticker {
    private _delta = 0;
    private _elapsed = 0;

    private startTime: number;
    private lastTime: number;

    constructor(startTime: number = performance.now()) {
        this.startTime = startTime;
        this.lastTime = startTime;
    }

    update(currentTime: number = performance.now()) {
        this._delta = (currentTime - this.lastTime) / 1000;
        this._elapsed = (currentTime - this.startTime) / 1000;
        this.lastTime = currentTime;
    }

    /**
     * @unit seconds
     */
    get delta() {
        return this._delta;
    }

    /**
     * @unit seconds
     */
    get elapsed() {
        return this._elapsed;
    }
}

export class ResourcesOld {
    [K: string]: any;
    public readonly ticker: Ticker = new Ticker();
}

// New

export type ResConstructor<T extends Resource<any> = Resource<any>> =
    T extends Resource<infer ArgsT>
    ? undefined extends ArgsT
    ? { new(args?: ArgsT): T; id: number }
    : { new(args: ArgsT): T; id: number }
    : { new(...args: any[]): T; id: number };

export type ResClass<T extends Resource<any> = Resource<any>> =
    T extends Resource<infer ArgsT>
    ? ArgsT extends void
    ? new () => T
    : new (args: ArgsT) => T
    : never;

export type ResInitializer<T extends Resource<any> = Resource<any>> =
    T extends Resource<infer ArgsT>
    ? ArgsT extends void
    ? { class: new () => T }
    : { class: new (args: ArgsT) => T; args: ArgsT }
    : never;

export type ResInitializersOf<T extends readonly Resource<any>[]> = {
    [K in keyof T]: ResInitializer<T[K]>
};

export type ResInstanceOfClass<C extends ResClass = ResClass> =
    C extends new (args: any) => infer I ? I : never;


// Resource decorator
export function createResource<const ResT extends ResConstructor>(target: ResT) {
    const id = Resource.nextId;
    target.id = id;
}

export abstract class Resource<ArgsT extends object | void = void> {
    private static _nextId = 0;
    public static get nextId() { return this._nextId++; }

    protected args: ArgsT;
    static id: number;

    constructor(args?: ArgsT) {
        this.args = args as ArgsT;
    }
}
