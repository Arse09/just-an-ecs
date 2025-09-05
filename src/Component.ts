/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type EntityOf<T extends any> = NonFunctionProperties<T>;

type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

export type ComponentConstructor<T extends Component<any> = Component<any>> =
    T extends Component<infer ArgsT>
    ? undefined extends ArgsT
    ? { new(args?: ArgsT): T; id: number }
    : { new(args: ArgsT): T; id: number }
    : { new(...args: any[]): T; id: number };


export interface ComponentInitializator<T extends Component = Component> {
    component: ComponentConstructor<T>;
    args?: Tail<Parameters<T['reset']>>;
}

/**
 * @deprecated Use createComponent. Note that you need to use new components, for more info see \@example
 * @param constructor
 * 
 * @example
 * - Old component:
    import { Component, makeComponent } from "perform-ecs";

    interface Args {
        vx: number;
        vy: number;
    }

    // Ignore the "\"
    \@makeComponent 
    export class VelocityC extends Component {
        public velocity!: Args;

        reset(object: this, args: Args): void {
            object.velocity = args;
        }
    }
 * 
 * - New component:
    import { Component, createComponent } from "perform-ecs";

    // Ignore the "\"
    \@createComponent
    export class VelocityC extends Component<{ vx: number; vy: number }> {
        public vx = this.args.vx;
        public vy = this.args.vy;
    }
 */
export function makeComponent<T extends ComponentConstructor>(constructor: T) {
    constructor.id = (Component as any)._idCounter++;
}

export abstract class Component<ArgsT extends object | void = void> {
    /** @deprecated */
    private static _idCounter = 0;
    static nextId = 0;
    static readonly id: number;

    /** @deprecated */
    public reset(entity: this, ...args: ArgsT extends object ? never : any): void { }

    // New
    constructor(args?: ArgsT) {
        this.args = args as ArgsT;
    }

    protected args: ArgsT;
}



// New
export type ComponentInitializer<T extends Component<any> = Component<any>> =
    T extends Component<infer ArgsT>
    ? ArgsT extends void
    ? { class: new () => T }
    : { class: new (args: ArgsT) => T; args: ArgsT }
    : never;


export type ComponentInstance<T extends ComponentInitializer = ComponentInitializer> =
    T extends { class: new (args: infer ArgsT) => infer C }
    ? C
    : T extends { class: new () => infer C }
    ? C
    : never;

export type ComponentClass<T extends Component<any> = Component<any>> =
    T extends Component<infer ArgsT>
    ? ArgsT extends void
    ? new () => T
    : new (args: ArgsT) => T
    : never;

export type ComponentInitializersOf<T extends readonly Component<any>[]> = {
    [K in keyof T]: ComponentInitializer<T[K]>
};


// Component decorator
export function createComponent<T extends ComponentConstructor>(target: T) {
    const id = Component.nextId++;
    target.id = id;
    (Component as any)._idCounter = id + 1;
}

