/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import type { AnySystemClass } from "./System";

type EmptyComponentArgs = { __emptyComp__?: Symbol };

//
export function createEmptyComponentArgs(obj?: AnySystemClass): EmptyComponentArgs {
    return { __emptyComp__: Symbol(obj ? obj.name : "") } as const;
}

// Component decorator
export function createComponent<const T extends AnyComponentClass>(target: T) { return target; }

// Component
export abstract class Component<const ArgsT extends object = EmptyComponentArgs> {
    private static nextId = 0;

    protected readonly $component: Symbol = Symbol("component");

    protected readonly args: ArgsT;
    protected readonly id: number;

    constructor(args: ArgsT) {
        this.args = args;
        this.id = Component.nextId++;
    }
}

// Types
export type AnyComponent = Component<any>;

export type ComponentClass<T extends Component> =
    T extends Component<infer ArgsT> ? ArgsT extends EmptyComponentArgs ? new (args: EmptyComponentArgs) => T : new (args: ArgsT) => T : never
export type AnyComponentClass = ComponentClass<AnyComponent>;

export type ComponentInstance<T extends AnyComponentClass> =
    T extends ComponentClass<infer Component> ? Component : never;
export type AnyComponentInstance = ComponentInstance<AnyComponentClass>;

export type ComponentInitializer<T extends AnyComponent> =
    T extends Component<infer ArgsT>
    ? ArgsT extends EmptyComponentArgs
    ? { class: ComponentClass<T> }
    : { class: ComponentClass<T>, args: ArgsT }
    : never
export type AnyComponentInitializer = ComponentInitializer<AnyComponent>;

export type ComponentInitializers<T extends readonly AnyComponent[]> = {
    [K in keyof T]: ComponentInitializer<T[K]>
}
export type AnyComponentInitializers = ComponentInitializers<AnyComponent[]>;

export type PrivateComponentInitializer<T extends AnyComponent> =
    T extends Component<infer ArgsT>
    ? { class: ComponentClass<T>, args: ArgsT }
    : never
export type AnyPrivateComponentInitializer = PrivateComponentInitializer<AnyComponent>;

export type PrivateComponentInitializers<T extends readonly AnyComponent[]> = {
    [K in keyof T]: PrivateComponentInitializer<T[K]>
}
export type AnyPrivateComponentInitializers = PrivateComponentInitializers<AnyComponent[]>;



