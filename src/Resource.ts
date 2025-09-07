/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

export type ResConstructor<T extends Resource<any>> =
    T extends Resource<infer U>
    ? { new(args: U): T; }
    : { new(...args: any[]): T; };

export type ResClass<T extends Resource<any>> =
    T extends Resource<infer U>
    ? new (args: U) => T
    : never;

export type ResInitializer<T extends Resource<any>> =
    T extends Resource<infer U>
    ? { class: new (args: U) => T; args: U }
    : never;

export type ResInitializersOf<T extends readonly Resource<any>[]> = {
    [K in keyof T]: ResInitializer<T[K]>
};

export type ResInstanceOfClass<C extends new (args: any) => any> =
    C extends new (args: any) => infer I ? I : never;

// Resource decorator (unchanged)
export function createResource<const ResT extends ResConstructor<Resource<any>>>(target: ResT) { }

// Updated Resource class: ArgsT must be an object, no default/void
export abstract class Resource<ArgsT extends object> {
    private static _nextId = 0;
    public static get nextId() { return this._nextId++; }

    protected readonly args: ArgsT;
    protected readonly id: number;

    constructor(args: ArgsT) {
        this.args = args;
        this.id = Resource.nextId;
    }
}
