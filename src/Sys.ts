/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";
import { Entity } from "./Entity";
import { Query } from "./Query";
import { ResourcesOld } from "./Resource";
import type { ResQuery } from "./ResourceRegistry";

export interface SysInstance {
    readonly ecs: ECS;
    readonly [query: `query${string}`]: Query<any>;
    readonly [res: `res${string}`]: ResQuery<any>;

    onEntityAdded?(entity: Entity): void;
    onEntityRemoved?(entity: Entity): void;

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
