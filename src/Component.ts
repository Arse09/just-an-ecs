/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

export type ComponentConstructor<T extends Component<any> = Component<any>> =
    T extends Component<infer ArgsT>
    ? undefined extends ArgsT
    ? { new(args?: ArgsT): T; id: number }
    : { new(args: ArgsT): T; id: number }
    : { new(...args: any[]): T; id: number };

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

export type ComponentInitializer<T extends Component<any> = Component<any>> =
    T extends Component<infer ArgsT>
    ? ArgsT extends void
    ? { class: new () => T }
    : { class: new (args: ArgsT) => T; args: ArgsT }
    : never;

export type ComponentInitializersOf<T extends readonly Component<any>[]> = {
    [K in keyof T]: ComponentInitializer<T[K]>
};

export type ComponentInstanceOfClass<C extends ComponentClass> =
    C extends new (...args: any) => infer I ? I : never;


export abstract class Component<const ArgsT extends object | void = void> {
    static nextId = 0;
    static readonly id: number;

    constructor(args?: ArgsT) {
        this.args = args as ArgsT;
    }

    protected args: ArgsT;
}

// Component decorator
export function createComponent<T extends ComponentConstructor>(target: T) {
    const id = Component.nextId++;
    target.id = id;
    (Component as any)._idCounter = id + 1;
}

