/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";

export interface SysInstance {
    readonly ecs: ECS;
    /* 
    // readonly query?: Query<any>;
    // readonly res?: ResQuery<any>;
    */

    // TODO: onEntityAdded?(entity: Entity): void;
    // TODO: onEntityRemoved?(entity: Entity): void;

    setup?(): void;
    update(): void;
    cleanup?(): void;
}

export type SysConstructor<T extends SysInstance> = new (...args: any[]) => T;

export abstract class Sys {
    readonly ecs: ECS;

    /* 
    // readonly query?: Query<any>;
    // readonly res?: ResQuery<any>;
    */

    constructor(ecs: ECS) {
        this.ecs = ecs;
    }
}

export class SysRegistry {
    readonly #systems: Map<SysConstructor<SysInstance>, SysInstance> = new Map();

    get systems(): Map<SysConstructor<SysInstance>, SysInstance> {
        return this.#systems;
    }

    public register<const SysInstanceT extends SysInstance>(sysClass: SysConstructor<SysInstanceT>, sysInstance: SysInstanceT) {
        this.#systems.set(sysClass, sysInstance)
    }

    public unregister<const SysInstanceT extends SysInstance>(sysClass: SysConstructor<SysInstanceT>): SysInstanceT | null {
        const sysInstance = this.#systems.get(sysClass);
        if (!sysInstance) return null;
        this.#systems.delete(sysClass);
        return sysInstance as SysInstanceT;
    }
}