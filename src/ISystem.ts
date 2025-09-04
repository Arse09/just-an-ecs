export interface ISystem {
    onEntityAdded?: (entity: any) => void;
    onEntityRemoved?: (entity: any) => void;

    update<T extends object>(time: T): void;
}

