/**
 * @original Arse09
 * @license MIT (LICENSE)
 */

import type { ECS } from "./ECS";

// System decorator
export function createSystem<const T extends AnySystemClass>(target: T) { return target; }

// System
export abstract class System {
    private static nextId = 0;

    protected readonly $$system: Symbol = Symbol("system");

    protected readonly id: number;
    protected readonly ecs: ECS;

    setup?(): void;
    update(): void { /* To be overriden */ };
    cleanup?(): void;

    constructor(ecs: ECS) {
        this.ecs = ecs;
        this.id = System.nextId++;
    }
}

// Types
export type AnySystem = System;

export type SystemClass<T extends System> = new (ecs: ECS) => T
export type AnySystemClass = SystemClass<AnySystem>;

export type SystemInstance<T extends AnySystemClass> = T extends SystemClass<infer System> ? System : never;
export type AnySystemInstance = SystemInstance<AnySystemClass>;