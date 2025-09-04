export interface ISystem {
    onEntityAdded?: (entity: any) => void;
    onEntityRemoved?: (entity: any) => void;

    update(time: object): void;
}

