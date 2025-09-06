/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, type ComponentClass, type ComponentInitializator, type ComponentInitializer, type ComponentInitializersOf } from "./Component";
import { ComponentIndex } from "./ComponentIndex";
import { type Prettify } from "./types";

export class Entity {
    public id!: number;
    /** @deprecated */
    public components: ComponentInitializator[];

    /**
     * @deprecated Use EntityFactory class to create entities
     * @param components 
     */
    constructor(components: ComponentInitializator[]);
    constructor(id: number, compMap: Map<ComponentClass<any>, Component<any>>, compIndex: ComponentIndex);

    constructor(componentsOrId: number | ComponentInitializator[], compMap?: Map<ComponentClass<any>, Component<any>>, compIndex?: ComponentIndex) {
        if (typeof componentsOrId === "number" && compMap instanceof Map && compIndex instanceof ComponentIndex) {
            this.id = componentsOrId;
            this.compMap = compMap;
            this.compIndex = compIndex;
            this.components = [];

            for (const CompClass of this.compMap.keys()) {
                this.compIndex.registerComponent(this, CompClass);
            }
        } else if (typeof componentsOrId !== "number" && compMap === undefined && compIndex === undefined) {
            this.components = componentsOrId;
            this.compIndex = new ComponentIndex;
            this.compMap = new Map();
        } else {
            throw new Error("Invalid Entity constructor arguments")
        }
    }

    // New

    private readonly compMap: Map<ComponentClass<any>, Component<any>>;
    private readonly compIndex: ComponentIndex;

    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail: true): Readonly<Omit<T, "reset">>;
    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail?: false): Readonly<Omit<T, "reset">> | undefined;
    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail = false): Readonly<Omit<T, "reset">> | undefined {
        const comp = this.compMap.get(CompClass);
        if (!comp) {
            if (fail) throw new Error("Component not found");
            return undefined;
        }
        return Object.freeze({ ...comp }) as unknown as Readonly<Omit<T, "reset">>;
    }


    write<T extends Component<any>>(CompClass: ComponentClass<T>, fail: true): Prettify<Omit<T, "reset">>;
    write<T extends Component<any>>(CompClass: ComponentClass<T>, fail?: false): Prettify<Omit<T, "reset">> | undefined;

    write<T extends Component<any>>(
        CompClass: ComponentClass<T>,
        fail: boolean = false
    ): Prettify<Omit<T, "reset">> | undefined {
        const comp = this.compMap.get(CompClass);
        if (!comp) {
            if (fail) throw new Error(`Component not found in entity`);
            return undefined;
        }
        return comp as unknown as Prettify<Omit<T, "reset">>;
    }

    // Components API
    addComps<const T extends readonly Component<any>[]>(
        ...compInits: ComponentInitializersOf<T>
    ) {
        for (const compInit of compInits) {
            const instance = 'args' in compInit ? new compInit.class(compInit.args) : new compInit.class();

            this.compMap.set(compInit.class, instance);

            this.compIndex.registerComponent(this, compInit.class);
        }
    }

    removeComps<const T extends readonly ComponentClass<any>[]>(
        ...compClasses: [...T]
    ) {
        for (let i = 0; i < compClasses.length; i++) {
            const C = compClasses[i];
            this.compMap.delete(C);

            this.compIndex.unregisterComponent(this, C);
        }
    }
}


// New

export class EntityFactory {
    private static nextEntityId = 0;

    private constructor() { }

    static create<InitsT extends ComponentInitializer[]>(
        compInits: [...InitsT],
        compIndex: ComponentIndex
    ): Entity {
        const entityId = this.nextEntityId++;

        const compMap = new Map<ComponentClass<any>, Component<any>>();
        for (const compInit of compInits) {
            const instance = 'args' in compInit ? new compInit.class(compInit.args) : new compInit.class();

            compMap.set(compInit.class, instance);
        }

        return new Entity(entityId, compMap, compIndex);
    }
}

