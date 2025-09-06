/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { Entity, EntityFactory } from "./Entity";

import { ComponentIndex } from "./ComponentIndex";
import {
    Component,
    type ComponentClass,
    type ComponentInitializer,
    type ComponentInitializersOf
} from "./Component";

import { ResRegistry, ResQuery } from "./ResQuery";
import { Resource, type ResClass, type ResInitializersOf } from "./Resource";

import { Query } from "./Query";
import { SysRegistry, type SysConstructor } from "./Sys";


export class ECS {
    constructor() { }

    public update(): void {
        for (const sys of this.sysRegistry.sys) {
            sys.update();
        }

        this._deleteFlaggedEntities();
    }

    private readonly sysRegistry = new SysRegistry();
    private readonly resRegistry = new ResRegistry();
    private readonly compIndex = new ComponentIndex();

    private readonly entitiesToDelete: Set<Entity> = new Set();


    /**
     * Creates a new entity with the given componets
     * @param compInits Components to create the entity with
     * @returns The entity
     */
    public newEntity<const T extends readonly Component<any>[]>(
        ...compInits: ComponentInitializersOf<T>
    ): Entity {
        const initializers: ComponentInitializer[] = compInits.map(init =>
            'args' in init ? { class: init.class, args: init.args } : { class: init.class }
        );

        const entity = EntityFactory.create(initializers, this.compIndex);
        return entity;
    }

    /**
     * Deletes an entity at the end of the update.
     * @param entity The entity to delete
     */
    public deleteEntity(entity: Entity) {
        this.entitiesToDelete.add(entity);
    }

    /**
     * Registers systems to the ECS.
     * @param systems 
     */
    public registerSys<const Ss extends SysConstructor[]>(
        ...systems: Ss
    ) {
        for (const SysClass of systems) {
            const instance = new SysClass(this);
            this.sysRegistry.register(instance);
        }
    }

    /**
     * Queries all the entities that have the specified components
     * @param comps Requiered components
     * @returns An iterable Query
     */
    public query<const T extends readonly ComponentClass<any>[]>(...comps: [...T]): Query<T> {
        return new Query(this.compIndex, [...comps]);
    }


    /**
     * Registers resources to the ECS.
     * @param resInits
     */
    public registerRes<const T extends readonly Resource<any>[]>(
        ...resInits: [...ResInitializersOf<T>]
    ) {
        for (const init of resInits) {
            const instance = 'args' in init ? new init.class(init.args) : new init.class();
            (this.resRegistry.register(init.class, instance));
        }
    }

    /**
     * Queries all the specified resources
     * @param resources 
     * @returns A ResQuery
     */
    public queryRes<const T extends readonly ResClass<any>[]>(...resources: [...T]): ResQuery<T> {
        return new ResQuery(this.resRegistry, resources);
    }


    private _deleteFlaggedEntities() {
        for (const entity of this.entitiesToDelete) {
            this.compIndex.removeEntity(entity);
        }
        this.entitiesToDelete.clear()
    }
}