/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";
import { Entity } from "./Entity";
import { Query } from "./Query";
import type { ResQuery } from "./ResQuery";

export interface SysInstance {
    readonly ecs: ECS;
    readonly [query: `query${string}`]: Query<any>;
    readonly [res: `res${string}`]: ResQuery<any>;

    // TODO: onEntityAdded?(entity: Entity): void;
    // TODO: onEntityRemoved?(entity: Entity): void;

    setup?(): void;
    update(): void;
}

export type SysConstructor<T extends SysInstance = SysInstance> = new (...args: any[]) => T;

export abstract class Sys {
    readonly ecs: ECS;
    readonly [query: `query${string}`]: Query<any>;
    readonly [res: `res${string}`]: ResQuery<any>;

    constructor(ecs: ECS) {
        this.ecs = ecs;
    }
}

export class SysRegistry {
    private readonly _systems: Set<SysInstance> = new Set();

    get sys(): Set<SysInstance> {
        return this._systems;
    }

    public register(system: SysInstance) {
        this._systems.add(system)
    }
}