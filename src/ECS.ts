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
import { SysRegistry, type SysConstructor, type SysInstance } from "./Sys";


export class ECS {
    private readonly sysRegistry = new SysRegistry();
    private readonly justRegisteredSys: Set<SysInstance> = new Set();
    private readonly sysToUnregister: Set<SysConstructor<SysInstance>> = new Set();

    private readonly resRegistry = new ResRegistry();
    private readonly compIndex = new ComponentIndex();

    private readonly entitiesToDelete: Set<Entity> = new Set();

    public update(): void {
        for (const sys of this.justRegisteredSys) sys.setup?.();
        this._unregisterFlaggedSys();
        this.justRegisteredSys.clear();

        for (const [_, sys] of this.sysRegistry.systems) sys.update();

        this._unregisterFlaggedSys();
        this._deleteFlaggedEntities();
    }

    /**
     * Creates a new entity with the given components
     * @param compInits Components to create the entity with
     * @returns The entity
     */
    public newEntity<const T extends readonly Component<any>[]>(
        ...compInits: ComponentInitializersOf<T>
    ): Entity {
        const initializers: ComponentInitializer<Component<any>>[] = compInits.map(init =>
            'args' in init ? { class: init.class, args: init.args } : { class: init.class }
        );

        const entity = EntityFactory.create(initializers, this.compIndex);
        return entity;
    }

    /**
     * Deletes an entity from the ecs(deferred until end of update).
     * @param entity The entity to delete
     */
    public deleteEntity(entity: Entity) {
        this.entitiesToDelete.add(entity);
    }

    /**
     * Registers systems to the ECS.
     * @param systems
     */
    public registerSys<const Ss extends SysConstructor<SysInstance>[]>(
        ...systems: Ss
    ) {
        for (const SysClass of systems) {
            if (!this.sysRegistry.systems.has(SysClass)) {
                const instance = new SysClass(this);
                this.sysRegistry.register(SysClass, instance);
                this.justRegisteredSys.add(instance);
            }
        }
    }


    /**
     * Unregisters a system from the ECS (deferred until end of current update step).
     * @param sys
     */
    public unregisterSys<const SysClassT extends SysConstructor<SysInstance>>(sys: SysClassT): void {
        if (this.sysRegistry.systems.has(sys)) {
            this.sysToUnregister.add(sys);
        }
    }

    /**
     * @param sys 
     * @returns true if sys is registered, false otherwise
     */
    public isSysRegistered<const SysClassT extends SysConstructor<SysInstance>>(sys: SysClassT): boolean {
        return this.sysRegistry.systems.has(sys) && !this.sysToUnregister.has(sys);
    }

    /**
     * Queries all the entities that have the specified components
     * @param comps Required components
     * @returns An iterable Query
     */
    public query<const T extends readonly ComponentClass<Component<any>>[]>(...comps: [...T]): Query<T> {
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
            const instance = new init.class(init.args);
            (this.resRegistry.register(init.class, instance));
        }
    }

    /**
     * Queries all the specified resources
     * @param resources 
     * @returns A ResQuery
     */
    public queryRes<const T extends readonly ResClass<Resource<any>>[]>(...resources: [...T]): ResQuery<T> {
        return new ResQuery(this.resRegistry, resources);
    }


    private _deleteFlaggedEntities() {
        for (const entity of this.entitiesToDelete) {
            this.compIndex.removeEntity(entity);
        }
        this.entitiesToDelete.clear()
    }

    private _unregisterFlaggedSys() {
        for (const sys of this.sysToUnregister) {
            const sysInstance = this.sysRegistry.unregister(sys);
            sysInstance?.cleanup?.();
        }
        this.sysToUnregister.clear();
    }
}