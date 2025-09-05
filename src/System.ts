/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { ECS } from "./ECS";
import { EntityView } from "./EntityViewFactory";
import { ISystem } from "./ISystem";

export class System implements ISystem {

    public ecs!: ECS;

    public update(time: object): void {

    }
}

export type ValuesOf<T extends any[]> = T[number];
type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;
export type SystemEntityType<T extends System, View extends keyof T> =
    T[View] extends EntityView<infer E> ? E : never;
