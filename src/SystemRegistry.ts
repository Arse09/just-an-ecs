/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

import { type ISystem } from "./ISystem";
import { type EntityView } from "./EntityViewFactory";
import { ComponentGroupRegistry } from "./ComponentGroupRegistry";
import { type SysInstance } from "./Sys";

/** @deprecated */
function isEntityView(obj: any): obj is EntityView {
    return (<EntityView>obj)._isEntityView;
}

export class SystemRegistry {
    /** @deprecated */
    public systems: ISystem[] = [];

    /** @deprecated */
    public legacyRegister(system: ISystem, groups: ComponentGroupRegistry): void {
        for (let key in system) {
            if (isEntityView((<any>system)[key])) {
                const view: EntityView = (<any>system)[key];
                const group = groups.get(view.components);
                view.entities = group.entities;
                if (view.onEntityAdded) {
                    group.onEntityAdded.push(view.onEntityAdded)
                }

                if (view.onEntityRemoved) {
                    group.onEntityRemoved.push(view.onEntityRemoved)
                }
            }
        }
        this.systems.push(system);
    }

    // New
    private readonly _systems: Set<SysInstance> = new Set();

    get sys(): Set<SysInstance> {
        return this._systems;
    }

    public register(system: SysInstance) {
        this._systems.add(system)
    }
}