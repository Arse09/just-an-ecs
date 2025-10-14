/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

import type { ECS } from "./ECS";

// System decorator
export function createSystem<const T extends AnySystemClass>(_target: T) { }

// System
export abstract class System {
    private static nextId = 0;

    protected readonly $$system: Symbol = Symbol("system");

    protected readonly id: number;
    protected readonly ecs: ECS;

    public setup?(): void;
    public update(): void { /* To be overridden */ };
    public cleanup?(): void;

    // @ts-ignore
    public constructor(ecs: ECS) {
        this.ecs = ecs;
        this.id = System.nextId++;
    }
}

// Types
export type AnySystem = System;

export type SystemClass<T extends AnySystem> = new (ecs: ECS) => T
export type AnySystemClass = SystemClass<AnySystem>;

export type SystemInstance<T extends AnySystemClass> = T extends SystemClass<infer System> ? System : never;
export type AnySystemInstance = SystemInstance<AnySystemClass>;