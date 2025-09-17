/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";
import type { AnySystemClass, AnySystemInstance, SystemClass, SystemInstance } from "./System";

/** 
 * @deprecated Dont use this implementation
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
 * @deprecated Dont use this implementation
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

    setup?(): void;
    update(): void { /* To be overriden */ };
    cleanup?(): void;

    constructor(ecs: ECS) {
        this.ecs = ecs;
    }
}


export class SystemRegistry {
    readonly #systems: Map<AnySystemClass, AnySystemInstance> = new Map();

    get systems(): Map<AnySystemClass, AnySystemInstance> {
        return this.#systems;
    }

    public register<const SysInstanceT extends AnySystemInstance>(sysClass: AnySystemClass, sysInstance: SysInstanceT) {
        this.#systems.set(sysClass, sysInstance)
    }

    public unregister<const SysInstanceT extends AnySystemInstance>(sysClass: AnySystemClass): SysInstanceT | null {
        const sysInstance = this.#systems.get(sysClass);
        if (!sysInstance) return null;
        this.#systems.delete(sysClass);
        return sysInstance as SysInstanceT;
    }
}
