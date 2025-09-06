/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import type { ResClass, Resource } from "./Resource";

export class ResQuery<const Rs extends readonly ResClass<any>[]> {
    private readonly _resources: Rs;
    private readonly resRegistry: ResRegistry;

    constructor(resRegistry: ResRegistry, resources: [...Rs]) {
        this.resRegistry = resRegistry;
        this._resources = resources;
    }

    read<T extends Resource<any>>(CompClass: ResClass<T>, fail: true): Readonly<T>;
    read<T extends Resource<any>>(CompClass: ResClass<T>, fail?: false): Readonly<T> | undefined;

    read<T extends Resource<any>>(CompClass: ResClass<T>, fail: boolean = false): Readonly<T> | undefined {
        const comp = this.resRegistry.get(CompClass);
        if (!comp) {
            if (fail) throw new Error("Resource not found");
            return undefined;
        }
        return Object.freeze({ ...comp });
    }


    write<T extends Resource<any>>(CompClass: ResClass<T>, fail: true): T;
    write<T extends Resource<any>>(CompClass: ResClass<T>, fail?: false): T | undefined;

    write<T extends Resource<any>>(CompClass: ResClass<T>, fail: boolean = false): T | undefined {
        const comp = this.resRegistry.get(CompClass);
        if (!comp) {
            if (fail) throw new Error(`Resource not found in entity`);
            return undefined;
        }
        return comp;
    }
}

export class ResRegistry {
    private readonly _resources = new Map<ResClass<Resource<any>>, Resource<any>>();

    get res() {
        return this._resources;
    }

    public register<ResT extends Resource<any>>(resClass: ResClass<ResT>, resource: ResT) {
        this._resources.set(resClass, resource);
    }

    public get<const ResT extends Resource<any>>(resClass: ResClass<ResT>): ResT {
        return this._resources.get(resClass) as ResT;
    }
}