/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

export type ComponentConstructor<T extends Component<any>> =
    T extends Component<infer ArgsT>
    ? undefined extends ArgsT
    ? { new(args?: ArgsT): T; id: number }
    : { new(args: ArgsT): T; id: number }
    : { new(...args: any[]): T; id: number };

export type ComponentInstance<T extends ComponentInitializer<Component<any>>> =
    T extends { class: new (args: infer ArgsT) => infer C }
    ? C
    : T extends { class: new () => infer C }
    ? C
    : never;

export type ComponentClass<T extends Component<any>> =
    T extends Component<infer ArgsT>
    ? ArgsT extends void
    ? new () => T
    : new (args: ArgsT) => T
    : never;

export type ComponentInitializer<T extends Component<any>> =
    T extends Component<infer ArgsT>
    ? ArgsT extends void
    ? { class: new () => T }
    : { class: new (args: ArgsT) => T; args: ArgsT }
    : never;

export type ComponentInitializersOf<T extends readonly Component<any>[]> = {
    [K in keyof T]: ComponentInitializer<T[K]>
};

export type ComponentInstanceOfClass<C extends ComponentClass<Component<any>>> =
    C extends new (...args: any) => infer I ? I : never;


export abstract class Component<const ArgsT extends object | void = void> {
    static nextId = 0;
    static readonly id: number;

    constructor(args?: ArgsT ) {
        this.args = args as ArgsT; // TODO: Replace assertion with good typing
    }

    protected args: ArgsT;
}

// Component decorator
export function createComponent<T extends ComponentConstructor<Component<any>>>(target: T) {
    const id = Component.nextId++;
    target.id = id;
    (Component as any)._idCounter = id + 1;
}

