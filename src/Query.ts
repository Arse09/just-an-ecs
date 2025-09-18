/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

import type { AnyComponentClass } from "./Component";
import { ComponentIndex } from "./ComponentIndex";
import { Entity } from "./Entity";

export class Query<const Cs extends readonly AnyComponentClass[]> {
    public readonly comps: Cs;
    private readonly compIndex: ComponentIndex;

    constructor(compIndex: ComponentIndex, comps: [...Cs]) {
        this.compIndex = compIndex;
        this.comps = comps;
    }

    get entities(): Entity[] {
        return this.compIndex.queryAll(this.comps);
    }

    [Symbol.iterator](): IterableIterator<Entity> {
        return this.entities[Symbol.iterator]();
    }
}