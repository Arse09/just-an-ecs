/**
 * @author fireveined
 * @contributor Arse09
 * @license MIT
 */

export abstract class Component {
    private static _idCounter = 0;
    static readonly id: number;

    public abstract reset(object: this, ...args: any[]): void;
}

export function makeComponent<T extends ComponentConstructor>(constructor: T) {
    constructor.id = (Component as any)._idCounter++;
}

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type EntityOf<T extends any> = NonFunctionProperties<T>;

type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

export type ComponentConstructor<T extends Component = Component> = {
    new(): T;
    id: number;
};

export interface ComponentInitializator<T extends Component = Component> {
    component: ComponentConstructor<T>;
    args?: Tail<Parameters<T['reset']>>;
}

