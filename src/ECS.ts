/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, ComponentClass, ComponentConstructor, ComponentInitializator, ComponentInitializer, ComponentInitializersOf } from "./Component";
import { Entity, EntityFactory } from "./Entity";
import { Archetype } from "./Archetype";
import { SystemRegistry } from "./SystemRegistry";
import { ComponentGroupRegistry } from "./ComponentGroupRegistry";
import { System } from "./System";
import { Sys, SysConstructor, SysInstance } from "./Sys";
import { Query } from "./Query";
import { ComponentIndex } from "./ComponentIndex";
import { Resources } from "./Resources";

export class ECS {
    /** @deprecated */
    private _systemsRegistry: SystemRegistry;
    /** @deprecated */
    private _groupsRegistry: ComponentGroupRegistry;
    /** @deprecated */
    private _components: Component[] = [];
    /**
     * @deprecated use EntityFactory to create entities
     */
    private _currentID: number = 0;

    constructor() {
        this._systemsRegistry = new SystemRegistry();
        this._groupsRegistry = new ComponentGroupRegistry();
    }

    /**
     * @deprecated Use deleteEntity()
     * @param entity 
     */
    public removeEntity(entity: Entity): void {
        this._groupsRegistry.removeEntity(entity);
    }

    /**
     * @deprecated Use entity.removeComps() and new components
     * @param entity 
     * @param componentInits 
     */
    public removeComponentsFromEntity(entity: Entity, components: ComponentConstructor[] | ComponentConstructor): void {
        if (!(components instanceof Array)) {
            this._groupsRegistry.removeComponentFromEntity(entity, components);
        } else {
            components.forEach(comp => this._groupsRegistry.removeComponentFromEntity(entity, comp))
        }
    }

    /**
     * @deprecated Use entity.addComps() and new components
     * @param entity 
     * @param componentInits 
     */
    public addComponentsToEntity(entity: Entity, componentInits: ComponentInitializator[]): void {
        entity.components.push(...componentInits);
        for (const componentInit of componentInits) {
            const compInstance = this._getComponentInstance(componentInit.component);
            compInstance.reset(entity as any, ...(componentInit.args ?? []));

        }
        this._groupsRegistry.pushEntity(entity, componentInits);
    }


    /**
     * @deprecated Use registerSys() and new system class (Sys)
     * @param system 
     * @returns 
     */
    public registerSystem<T extends System = System>(system: T): T {
        system.ecs = this;
        this._systemsRegistry.legacyRegister(system, this._groupsRegistry);
        return system;
    }

    /**
     * @deprecated Use newEntity()
     * @param components
     * @returns
     */
    public createEntity<T extends Component[]>(components: ComponentInitializator<T[number]>[]): Entity {
        const entity = new Entity([]);
        entity.id = this._currentID++;
        this.addComponentsToEntity(entity, components);
        return entity;
    }


    /** @deprecated */
    private _getComponentInstance<T extends Component>(component: ComponentConstructor<T>): T {
        if (!this._components[component.id]) {
            this._components[component.id] = new component();
        }
        return this._components[component.id] as T;
    }

    /** @deprecated */
    public createArchetype(components: ComponentInitializator[]): Archetype {
        return components;
    }

    public update<T extends object>(time: T): void {
        for (const system of this._systemsRegistry.systems) {
            system.update(time);
        }

        // New

        for (const sys of this.sysRegistry.sys) {
            sys.update();
        }

        this._deleteFlaggedEntities();
    }

    // New

    private readonly sysRegistry = new SystemRegistry();
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
     * @param system A system (Sys)
     * @param systems Extra systems
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
     * @returns An iterable query
     */
    public query<const T extends readonly ComponentClass<any>[]>(...comps: [...T]): Query<T> {
        return new Query(this.compIndex, [...comps]);
    }

    /**
     * @experimental
     * @returns 
     */
    public queryRes(): Resources {
        return new Resources(); // TODO: Resources
    }


    private _deleteFlaggedEntities() {
        for (const entity of this.entitiesToDelete) {
            this.compIndex.removeEntity(entity);
        }
        this.entitiesToDelete.clear()
    }

}


/** @deprecated */
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
/** @deprecated */
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
/** @deprecated */
type ComponentOf<T extends ComponentInitializator> = NonFunctionProperties<InstanceType<T['component']>>;

/** @deprecated */
type createEntityFunc = <T extends ComponentInitializator,
    T2 extends ComponentInitializator,
    T3 extends ComponentInitializator,
    T4 extends ComponentInitializator,
    T5 extends ComponentInitializator,
    T6 extends ComponentInitializator,
    T7 extends ComponentInitializator,
    T8 extends ComponentInitializator,
    T9 extends ComponentInitializator,
    T10 extends ComponentInitializator>(comps: ComponentsInitList<T, T2, T3, T4, T5, T6, T7, T8, T9, T10>)
    => ComponentOf<T> & ComponentOf<T2> & ComponentOf<T3> & ComponentOf<T4> & ComponentOf<T5> & ComponentOf<T6>
    & ComponentOf<T7> & ComponentOf<T8> & ComponentOf<T9> & ComponentOf<T10> & Entity;

/** @deprecated */
type ComponentsInitList<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> =
    Partial<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]> | { length: any } & {
        '0'?: T1;
        '1'?: T2;
        '2'?: T3;
        '3'?: T4;
        '4'?: T5;
        '5'?: T6;
        '6'?: T7;
        '7'?: T8;
        '8'?: T9;
        '9'?: T10;
    }