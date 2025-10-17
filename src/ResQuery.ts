/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

import type {AnyResource, AnyResourceClass, ResourceClass} from "./Resource";
import type {Immutable, Mutable} from "./types";

export class ResQuery<const Rs extends readonly AnyResourceClass[]> {
    private readonly _resources: Rs;
    private readonly resRegistry: ResRegistry;

    constructor(resRegistry: ResRegistry, resources: [...Rs]) {
        this.resRegistry = resRegistry;
        this._resources = resources;
    }

    public read<T extends AnyResource>(ResClass: ResourceClass<T>, fail: true): Immutable<T>;
    public read<T extends AnyResource>(ResClass: ResourceClass<T>, fail?: false): Immutable<T> | undefined;

    public read<T extends AnyResource>(ResClass: ResourceClass<T>, fail: boolean = false): Immutable<T> | undefined {
        const res = this.resRegistry.get(ResClass);
        if (!res) {
            if (fail) throw new Error("Resource not found");
            return undefined;
        }
        return res as unknown as Immutable<T>;
    }

    public write<T extends AnyResource>(ResClass: ResourceClass<T>, fail: true): Mutable<T>;
    public write<T extends AnyResource>(ResClass: ResourceClass<T>, fail?: false): Mutable<T> | undefined;

    public write<T extends AnyResource>(ResClass: ResourceClass<T>, fail: boolean = false): Mutable<T> | undefined {
        const res = this.resRegistry.get(ResClass);
        if (!res) {
            if (fail) throw new Error(`Resource not found in entity`);
            return undefined;
        }
        return res as Mutable<T>;
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