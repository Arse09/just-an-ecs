/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";
import { Entity } from "./Entity";
import { Query } from "./Query";
import { Resources, Ticker } from "./Resources";

export interface SysInstance {
    readonly ecs: ECS;
    readonly query: Query<any>;
    readonly res?: Resources; // TODO: Resources

    onEntityAdded?(entity: Entity): void;
    onEntityRemoved?(entity: Entity): void;

    setup?(): void;
    update(): void;
}

export abstract class Sys {
    readonly ecs!: ECS;
}
