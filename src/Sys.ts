/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";
import { System, type AnySystemClass, type AnySystemInstance, type SystemClass } from "./System";

/** 
 * @deprecated Don't use this implementation. If using as a type, use `type SystemInstance` instead.
 * @example 
 * - Old system
 *  export class TestMovementS extends Sys implements SysInstance {
 *      // ... 
 *  }
 * 
 * - New system (ignore "\")
 * \@createSystem
 * export class TestMovementS extends System {
 *      // ... 
 *  }
 */
export interface SysInstance {
    readonly ecs: ECS;

    setup?(): void;
    update(): void;
    cleanup?(): void;
}
/** 
 * @deprecated Use the new `System` class instead.
 * @example 
 * - Old system
 *  export class TestMovementS extends Sys implements SysInstance {
 *      // ... 
 *  }
 * 
 * - New system (ignore "\")
 * \@createSystem
 * export class TestMovementS extends System {
 *      // ... 
 *  }
 */
export abstract class Sys {
    readonly ecs: ECS;

    protected readonly $$old_system = Symbol("old-system");

    setup?(): void;
    update(): void { /* To be overriden */ };
    cleanup?(): void;

    constructor(ecs: ECS) {
        this.ecs = ecs;
    }
}

/** 
 * @deprecated Use the new `type SystemClass` instead
 * @example 
 * - Old system
 *  export class TestMovementS extends Sys implements SysInstance {
 *      // ... 
 *  }
 * 
 * - New system (ignore "\")
 * \@createSystem
 * export class TestMovementS extends System {
 *      // ... 
 *  }
 */
export type SysConstructor<T extends SysInstance> = new (...args: any[]) => T;


export class SystemRegistry {
    readonly #systems: Map<AnySystemClass, AnySystemInstance> = new Map();

    get systems(): Map<AnySystemClass, AnySystemInstance> {
        return this.#systems;
    }

    public register<const SysInstanceT extends AnySystemInstance>(sysClass: SystemClass<SysInstanceT>, sysInstance: SysInstanceT) {
        this.#systems.set(sysClass, sysInstance)
    }

    public unregister<const SysInstanceT extends AnySystemInstance>(sysClass: SystemClass<SysInstanceT>): SysInstanceT | null {
        const sysInstance = this.#systems.get(sysClass);
        if (!sysInstance) return null;
        this.#systems.delete(sysClass);
        return sysInstance as SysInstanceT;
    }
}
