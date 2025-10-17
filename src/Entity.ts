/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE)
 */

import {
    type AnyComponent,
    type AnyComponentClass,
    type ComponentClass,
    type PrivateComponentInitializer,
    type PrivateComponentInitializers
} from "./Component";
import {ComponentIndex} from "./ComponentIndex";
import type {Immutable, Mutable} from "./types";

export class Entity {
    public id: number;

    constructor(id: number, compMap: Map<AnyComponentClass, AnyComponent>, compIndex: ComponentIndex) {
        this.id = id;
        this.compIndex = compIndex;
        this.compMap = compMap;

        for (const CompClass of this.compMap.keys()) {
            this.compIndex.registerComponent(this, CompClass);
        }
    }

    private readonly compMap: Map<AnyComponentClass, AnyComponent>;
    private readonly compIndex: ComponentIndex;

    public read<T extends AnyComponent>(CompClass: ComponentClass<T>, fail: true): Immutable<T>;
    public read<T extends AnyComponent>(CompClass: ComponentClass<T>, fail?: false): Immutable<T> | undefined;

    public read<T extends AnyComponent>(CompClass: ComponentClass<T>, fail = false): Immutable<T> | undefined {
        const comp = this.compMap.get(CompClass);
        if (!comp) {
            if (fail) throw new Error("Component not found");
            return undefined;
        }
        return comp as unknown as Immutable<T>;
    }


    public write<T extends AnyComponent>(CompClass: ComponentClass<T>, fail: true): Mutable<T>;
    public write<T extends AnyComponent>(CompClass: ComponentClass<T>, fail?: false): Mutable<T> | undefined;

    public write<T extends AnyComponent>(
        CompClass: ComponentClass<T>,
        fail: boolean = false
    ): T | undefined {
        const comp = this.compMap.get(CompClass);
        if (!comp) {
            if (fail) throw new Error(`Component not found in entity`);
            return undefined;
        }
        return comp as Mutable<T>;
    }

    public has<T extends AnyComponent>(CompClass: ComponentClass<T>): boolean {
        return this.compMap.has(CompClass);
    }


    public addComps<const T extends readonly AnyComponent[]>(
        ...compInits: PrivateComponentInitializers<T>
    ) {
        for (const compInit of compInits) {
            const instance = new compInit.class(compInit.args);

            this.compMap.set(compInit.class, instance);

            this.compIndex.registerComponent(this, compInit.class);
        }
    }

    public removeComps<const T extends readonly AnyComponentClass[]>(
        ...compClasses: [...T]
    ) {
        for (let i = 0; i < compClasses.length; i++) {
            const C = compClasses[i];
            this.compMap.delete(C);

            this.compIndex.unregisterComponent(this, C);
        }
    }
}

export class EntityFactory {
    private static nextEntityId = 0;

    private constructor() {
    }

    static create<InitsT extends PrivateComponentInitializer<AnyComponent>[]>(
        compInits: [...InitsT],
        compIndex: ComponentIndex
    ): Entity {
        const entityId = this.nextEntityId++;

        const compMap = new Map<ComponentClass<AnyComponent>, AnyComponent>();
        for (const compInit of compInits) {
            const instance = new compInit.class(compInit.args);

            compMap.set(compInit.class, instance);
        }

        return new Entity(entityId, compMap, compIndex);
    }
}

