/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

export interface ISystem {
    onEntityAdded?: (entity: any) => void;
    onEntityRemoved?: (entity: any) => void;

    update(time: object): void;
}
