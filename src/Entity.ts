/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, type ComponentClass, type ComponentInitializer, type ComponentInitializersOf } from "./Component";
import { ComponentIndex } from "./ComponentIndex";

export class Entity {
    public id: number;

    constructor(id: number, compMap: Map<ComponentClass<Component<any>>, Component<any>>, compIndex: ComponentIndex) {
        this.id = id;
        this.compMap = compMap;
        this.compIndex = compIndex;

        for (const CompClass of this.compMap.keys()) {
            this.compIndex.registerComponent(this, CompClass);
        }
    }

    private readonly compMap: Map<ComponentClass<any>, Component<any>>;
    private readonly compIndex: ComponentIndex;

    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail: true): Readonly<T>;
    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail?: false): Readonly<T> | undefined;
    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail = false): Readonly<T> | undefined {
        const comp = this.compMap.get(CompClass);
        if (!comp) {
            if (fail) throw new Error("Component not found");
            return undefined;
        }
        return Object.freeze({ ...comp }) as unknown as Readonly<T>;
    }


    write<T extends Component<any>>(CompClass: ComponentClass<T>, fail: true): T;
    write<T extends Component<any>>(CompClass: ComponentClass<T>, fail?: false): T | undefined;

    write<T extends Component<any>>(
        CompClass: ComponentClass<T>,
        fail: boolean = false
    ): T | undefined {
        const comp = this.compMap.get(CompClass);
        if (!comp) {
            if (fail) throw new Error(`Component not found in entity`);
            return undefined;
        }
        return comp as unknown as T;
    }

    has<T extends Component<any>>(CompClass: ComponentClass<T>): boolean {
        return this.compMap.has(CompClass);
    }

    
    addComps<const T extends readonly Component<any>[]>(
        ...compInits: ComponentInitializersOf<T>
    ) {
        for (const compInit of compInits) {
            const instance = 'args' in compInit ? new compInit.class(compInit.args) : new compInit.class();

            this.compMap.set(compInit.class, instance);

            this.compIndex.registerComponent(this, compInit.class);
        }
    }

    removeComps<const T extends readonly ComponentClass<Component<any>>[]>(
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

    private constructor() { }

    static create<InitsT extends ComponentInitializer<Component<any>>[]>(
        compInits: [...InitsT],
        compIndex: ComponentIndex
    ): Entity {
        const entityId = this.nextEntityId++;

        const compMap = new Map<ComponentClass<Component<any>>, Component<any>>();
        for (const compInit of compInits) {
            const instance = 'args' in compInit ? new compInit.class(compInit.args) : new compInit.class();

            compMap.set(compInit.class, instance);
        }

        return new Entity(entityId, compMap, compIndex);
    }
}

