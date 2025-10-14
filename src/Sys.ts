/**
 * @original MIT code fireveined
 * @contributor Arse09
 * @license MIT (LICENSE)
 */

import {type AnySystemClass, type AnySystemInstance, type SystemClass} from "./System";


export class SystemRegistry {
    readonly #systems: Map<AnySystemClass, AnySystemInstance> = new Map();

    get systems(): Map<AnySystemClass, AnySystemInstance> {
        return this.#systems;
    }

    public register<const SysInstanceT extends AnySystemInstance>(sysClass: SystemClass<SysInstanceT>, sysInstance: SysInstanceT) {
        this.#systems.set(sysClass, sysInstance)
    }

    public unregister<const SysInstanceT extends AnySystemInstance>(sysClass: SystemClass<SysInstanceT>): SysInstanceT | null {
        const sysInstance = this.#systems.get(sysClass);
        if (!sysInstance) return null;
        this.#systems.delete(sysClass);
        return sysInstance as SysInstanceT;
    }
}
