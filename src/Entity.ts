/**
 * @author fireveined
 * @contributor Arse09
 * @license MIT
 */

import { Component, ComponentClass, ComponentInitializator, ComponentInitializer, ComponentInstance } from "./Component";
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
}


// New

export class EntityFactory {
    private static nextEntityId = 0;

    static create<Inits extends ComponentInitializer[]>(
        compInits: [...Inits]
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

