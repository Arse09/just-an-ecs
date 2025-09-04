/**
 * @author fireveined
 * @contributor Arse09
 * @license MIT
 */

import { Component, ComponentConstructor, ComponentInitializator } from "./Component";
import { Entity } from "./Entity";
import { Archetype } from "./Archetype";
import { SystemRegistry } from "./SystemRegistry";
import { ComponentGroupRegistry } from "./ComponentGroupRegistry";
import { System } from "./System";

export class ECS {

    private _systemsRegistry: SystemRegistry;
    private _groupsRegistry: ComponentGroupRegistry;
    private _components: Component[] = [];
    private _currentID: number = 0;

    constructor() {
        this._systemsRegistry = new SystemRegistry();
        this._groupsRegistry = new ComponentGroupRegistry();
    }

    public removeEntity(entity: Entity): void {
        this._groupsRegistry.removeEntity(entity);
    }

    public removeComponentsFromEntity(entity: Entity, components: ComponentConstructor[] | ComponentConstructor): void {
        if (!(components instanceof Array)) {
            this._groupsRegistry.removeComponentFromEntity(entity, components);
        } else {
            components.forEach(comp => this._groupsRegistry.removeComponentFromEntity(entity, comp))
        }
    }

    public addComponentsToEntity(entity: Entity, componentInits: ComponentInitializator[]): void {
        entity.components.push(...componentInits);
        for (const componentInit of componentInits) {
            const compInstance = this._getComponentInstance(componentInit.component);
            compInstance.reset(compInstance, ...(componentInit.args ?? []));

        }
        this._groupsRegistry.pushEntity(entity, componentInits);
    }


    public registerSystem<T extends System = System>(system: T): T {
        system.ecs = this;
        this._systemsRegistry.register(system, this._groupsRegistry);
        return system;
    }

    public update<T extends object>(time: T): void {
        for (const system of this._systemsRegistry.systems) {
            system.update(time);
        }
    }

    public createEntity<T extends Component[]>(components: ComponentInitializator<T[number]>[]): Entity {
        const entity = new Entity([]);
        entity.id = this._currentID++;
        this.addComponentsToEntity(entity, components);
        return entity;
    }


    private _getComponentInstance<T extends Component>(component: ComponentConstructor<T>): T {
        if (!this._components[component.id]) {
            this._components[component.id] = new component();
        }
        return this._components[component.id] as T;
    }

    public createArchetype(components: ComponentInitializator[]): Archetype {
        return components;
    }

}


type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
type ComponentOf<T extends ComponentInitializator> = NonFunctionProperties<InstanceType<T['component']>>;


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
    & ComponentOf<T7> & ComponentOf<T8> & ComponentOf<T9> & ComponentOf<T10> & Entity ;


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