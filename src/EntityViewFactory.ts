/**
 * @author fireveined
 * @contributor Arse09
 * @license MIT
 */

import { ComponentConstructor } from "./Component";
import { Entity } from "./Entity";
import { SystemEntityType } from "./System";

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
type ComponentOf<T extends new (...args: any) => any> = NonFunctionProperties<InstanceType<T>>;

export interface EntityView<T = any[]> {
    entities: T[];
    onEntityAdded?: (entity: T) => void;
    onEntityRemoved?: (entity: T) => void;
    components: ComponentConstructor[];
    _isEntityView: boolean;
}

export interface EntityViewInitializator<Components extends ComponentConstructor[] = ComponentConstructor[]> {
    components: Components;
    onEntityAdded?: (entity: EntityViewOf<Components>) => void;
    onEntityRemoved?: (entity: EntityViewOf<Components>) => void;
}

export class EntityViewFactory {
    static createView<Components extends ComponentConstructor[]>(
        data: EntityViewInitializator<Components>
    ): EntityView<{ [K in keyof Components]: ComponentOf<Components[K]> } & NonFunctionProperties<Entity>> {

        const view = {
            entities: [] as Array<{ [K in keyof Components]: ComponentOf<Components[K]> } & NonFunctionProperties<Entity>>,
            components: data.components,
            onEntityAdded: data.onEntityAdded,
            onEntityRemoved: data.onEntityRemoved,
            _isEntityView: true
        } as EntityView<{ [K in keyof Components]: ComponentOf<Components[K]> } & NonFunctionProperties<Entity>>;

        return view;
    }
}

export type EntityViewOf<Components extends ComponentConstructor[]> =
    { [K in keyof Components]: ComponentOf<Components[K]> } & NonFunctionProperties<Entity>;
