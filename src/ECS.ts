/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE)
 */

import {Entity, EntityFactory} from "./Entity";

import {ComponentIndex} from "./ComponentIndex";
import {
    type AnyComponent,
    type ComponentClass,
    type ComponentInitializers,
    type PrivateComponentInitializers,
} from "./Component";

import {ResQuery, ResRegistry} from "./ResQuery";
import {type AnyResource, type AnyResourceClass, type ResourceInitializers} from "./Resource";

import {Query} from "./Query";

import {SystemRegistry} from "./Sys";
import {type AnySystem, type AnySystemClass, type SystemClass} from "./System";


export class ECS {
    private readonly sysRegistry = new SystemRegistry();
    private readonly justRegisteredSys: Set<AnySystem> = new Set();
    private readonly sysToUnregister: Set<AnySystemClass> = new Set();

    private readonly resRegistry = new ResRegistry();
    private readonly compIndex = new ComponentIndex();

    private readonly entitiesToDelete: Set<Entity> = new Set();

    private stopFlag = false;

    public update(): void {
        for (const sys of this.justRegisteredSys) sys.setup?.();
        this._unregisterFlaggedSys();
        this.justRegisteredSys.clear();

        for (const [_, sys] of this.sysRegistry.systems) sys.update();

        this._unregisterFlaggedSys();
        this._deleteFlaggedEntities();
    }

    /**
     * Starts a loop that updates the ECS every frame.
     */
    public start(): void {
        let loop = () => {
            if (this.stopFlag) return;

            this.update();
            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }

    /**
     * Stops the ECS from updating.
     * Only works if the ECS was started via ECS.start().
     */
    public stop() {
        this.stopFlag = true;
    }

    /**
     * Creates a new entity with the given components
     * @param compInits Components to create the entity with
     * @returns The entity
     */
    public newEntity<const T extends readonly AnyComponent[]>(
        ...compInits: ComponentInitializers<T>
    ): Entity {
        const initializers: PrivateComponentInitializers<AnyComponent[]> = compInits.map(init =>
            'args' in init ? {class: init.class, args: init.args} : {
                class: init.class,
                args: {__emptyComp__: Symbol(init.class.name)} as const
            }
        );

        return EntityFactory.create(initializers, this.compIndex);
    }

    /**
     * Deletes an entity from the ecs(deferred until the end of update).
     * @param entity The entity to delete
     */
    public deleteEntity(entity: Entity) {
        this.entitiesToDelete.add(entity);
    }

    /**
     * Registers systems to the ECS.
     * @param systems
     */
    public registerSys<const Ss extends readonly AnySystemClass[]>(
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
     * Unregisters a system from the ECS (deferred until the end of the current update step).
     * @param sys
     */
    public unregisterSys<const SysClassT extends SystemClass<AnySystem>>(sys: SysClassT): void {
        if (this.sysRegistry.systems.has(sys)) {
            this.sysToUnregister.add(sys);
        }
    }

    /**
     * @param sys
     * @returns true if sys is registered, false otherwise
     */
    public isSysRegistered<const SysClassT extends SystemClass<AnySystem>>(sys: SysClassT): boolean {
        return this.sysRegistry.systems.has(sys) && !this.sysToUnregister.has(sys);
    }

    /**
     * Queries all the entities that have the specified components
     * @param comps Required components
     * @returns An iterable Query
     */
    public query<const T extends readonly ComponentClass<AnyComponent>[]>(...comps: [...T]): Query<T> {
        return new Query(this.compIndex, [...comps]);
    }


    /**
     * Registers resources to the ECS.
     * @param resInits
     */
    public registerRes<const T extends readonly AnyResource[]>(...resInits: ResourceInitializers<T>) {
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
    public queryRes<const T extends readonly AnyResourceClass[]>(...resources: [...T]): ResQuery<T> {
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
            const System = this.sysRegistry.unregister(sys);
            System?.cleanup?.();
        }
        this.sysToUnregister.clear();
    }
}