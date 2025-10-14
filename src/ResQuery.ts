/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

import type {ResourceClass, AnyResource, AnyResourceClass} from "./Resource";

export class ResQuery<const Rs extends readonly AnyResourceClass[]> {
    private readonly _resources: Rs;
    private readonly resRegistry: ResRegistry;

    constructor(resRegistry: ResRegistry, resources: [...Rs]) {
        this.resRegistry = resRegistry;
        this._resources = resources;
    }

    public read<T extends AnyResource>(ResClass: ResourceClass<T>, fail: true): Readonly<T>;
    public read<T extends AnyResource>(ResClass: ResourceClass<T>, fail?: false): Readonly<T> | undefined;

    public read<T extends AnyResource>(ResClass: ResourceClass<T>, fail: boolean = false): Readonly<T> | undefined {
        const comp = this.resRegistry.get(ResClass);
        if (!comp) {
            if (fail) throw new Error("Resource not found");
            return undefined;
        }
        return Object.freeze({...comp});
    }


    public write<T extends AnyResource>(ResClass: ResourceClass<T>, fail: true): T;
    public write<T extends AnyResource>(ResClass: ResourceClass<T>, fail?: false): T | undefined;

    public write<T extends AnyResource>(ResClass: ResourceClass<T>, fail: boolean = false): T | undefined {
        const comp = this.resRegistry.get(ResClass);
        if (!comp) {
            if (fail) throw new Error(`Resource not found in entity`);
            return undefined;
        }
        return comp;
    }
}

export class ResRegistry {
    private readonly _resources = new Map<AnyResourceClass, AnyResource>();

    get res() {
        return this._resources;
    }

    public register<ResT extends AnyResource>(ResourceClass: ResourceClass<ResT>, resource: ResT) {
        this._resources.set(ResourceClass, resource);
    }

    public get<const ResT extends AnyResource>(ResourceClass: ResourceClass<ResT>): ResT {
        return this._resources.get(ResourceClass) as ResT;
    }
}