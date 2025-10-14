/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

// Resource decorator
export function createResource<const ResourceT extends AnyResourceClass>(resourceClass: ResourceT) {
    return resourceClass;
}

// Resource
export abstract class Resource<ArgsT extends object> {
    private static nextId = 0;

    protected readonly $resource: Symbol = Symbol("resource");

    protected readonly args: ArgsT;
    protected readonly id: number;

    protected constructor(args: ArgsT) {
        this.args = args;
        this.id = Resource.nextId++;
    }
}

export type AnyResource = Resource<any>;

export type ResourceClass<T extends AnyResource> = T extends Resource<infer ArgsT> ? new (args: ArgsT) => T : never
export type AnyResourceClass = ResourceClass<AnyResource>;

export type ResourceInstance<T extends AnyResourceClass> = T extends ResourceClass<infer Resource> ? Resource : never;
export type AnyResourceInstance = ResourceInstance<AnyResourceClass>;

export type ResourceInitializer<T extends AnyResource> =
    T extends Resource<infer ArgsT> ? { class: ResourceClass<T>, args: ArgsT } : never;
export type AnyResourceInitializer = ResourceInitializer<AnyResource>;

export type ResourceInitializers<T extends readonly AnyResource[]> = { [K in keyof T]: ResourceInitializer<T[K]> };
export type AnyResourceInitializers = ResourceInitializers<AnyResource[]>
