/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, ComponentClass, ComponentInitializator, ComponentInitializer, ComponentInitializersOf, ComponentInstance } from "./Component";
import { Prettify } from "./types";

export class Entity {
    public id!: number;
    /** @deprecated */
    public components: ComponentInitializator[];

    /**
     * @deprecated Use EntityFactory class to create entities
     * @param components 
     */
    constructor(components: ComponentInitializator[]);
    constructor(id: number, compMap: Map<ComponentClass<any>, Component<any>>);

    constructor(componentsOrId: number | ComponentInitializator[], compMap?: Map<ComponentClass<any>, Component<any>>) {
        if (typeof componentsOrId === "number" && compMap instanceof Map) {
            this.id = componentsOrId;
            this.compMap = compMap;
            this.components = [];
        } else if (typeof componentsOrId !== "number" && !(compMap instanceof Map)) {
            this.components = componentsOrId;
            this.compMap = new Map();
        } else {
            throw new Error("Invalid Entity constructor arguments")
        }
    }

    // New

    private readonly compMap: Map<ComponentClass<any>, Component<any>>;

    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail: true): Readonly<Prettify<Omit<T, "reset">>>;
    read<T extends Component<any>>(CompClass: ComponentClass<T>, fail?: false): Readonly<Prettify<Omit<T, "reset">>> | undefined;

    read<T extends Component<any>>(
        CompClass: ComponentClass<T>,
        fail: boolean = false
    ): Readonly<Prettify<Omit<T, "reset">>> | undefined {
        const comp = this.compMap.get(CompClass as any); // runtime Map key
        if (!comp) {
            if (fail) throw new Error(`Component not found in entity`);
            return undefined;
        }
        return Object.freeze(comp) as unknown as Readonly<Prettify<Omit<T, "reset">>>;
    }


    write<T extends Component<any>>(CompClass: ComponentClass<T>, fail: true): Prettify<Omit<T, "reset">>;
    write<T extends Component<any>>(CompClass: ComponentClass<T>, fail?: false): Prettify<Omit<T, "reset">> | undefined;

    write<T extends Component<any>>(
        CompClass: ComponentClass<T>,
        fail: boolean = false
    ): Prettify<Omit<T, "reset">> | undefined {
        const comp = this.compMap.get(CompClass as any);
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
        const instances = compInits.map(init =>
            'args' in init ? new init.class(init.args) : new init.class()
        );

        for (let i = 0; i < compInits.length; i++) {
            this.compMap.set(compInits[i].class, instances[i]);
        }
    }

    removeComps<const T extends readonly ComponentClass<any>[]>(
        ...compClasses: [...T]
    ) {
        for (let i = 0; i < compClasses.length; i++) {
            this.compMap.delete(compClasses[i])
        }
    }
}


// New

export class EntityFactory {
    private static nextEntityId = 0;

    private constructor() { }

    static create<InitsT extends ComponentInitializer[]>(
        compInits: [...InitsT]
    ): Entity {
        const entityId = this.nextEntityId++;

        const instances = compInits.map(init =>
            'args' in init ? new init.class(init.args) : new init.class()
        );

        const compMap = new Map<ComponentClass<any>, Component<any>>();
        for (let i = 0; i < compInits.length; i++) {
            compMap.set(compInits[i].class, instances[i]);
        }

        return new Entity(entityId, compMap);
    }
}

