/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import { Entity } from "./Entity";
import { ComponentClass } from "./Component";

export class ComponentIndex {
    private readonly index = new Map<ComponentClass<any>, Set<Entity>>();

    registerComponent(entity: Entity, CompClass: ComponentClass<any>): void {
        let set = this.index.get(CompClass);
        if (!set) {
            set = new Set<Entity>();
            this.index.set(CompClass, set);
        }
        set.add(entity);
    }

    unregisterComponent(entity: Entity, CompClass: ComponentClass<any>): void {
        const set = this.index.get(CompClass);
        if (!set) return;
        set.delete(entity);
        if (set.size === 0) this.index.delete(CompClass);
    }

    removeEntity(entity: Entity): void {
        for (const [CompClass, set] of this.index) {
            if (set.has(entity)) {
                set.delete(entity);
                if (set.size === 0) this.index.delete(CompClass);
            }
        }
    }

    queryAll(componentClasses: readonly ComponentClass<any>[]): Entity[] {
        if (componentClasses.length === 0) {
            const all = new Set<Entity>();
            for (const s of this.index.values()) {
                for (const e of s) all.add(e);
            }
            return Array.from(all);
        }

        const sets: Set<Entity>[] = [];
        for (const C of componentClasses) {
            const s = this.index.get(C);
            if (!s) return [];
            sets.push(s);
        }

        sets.sort((a, b) => a.size - b.size);

        const smallest = sets[0];
        const others = sets.slice(1);
        const out: Entity[] = [];

        for (const e of smallest) {
            let ok = true;
            for (const s of others) {
                if (!s.has(e)) { ok = false; break; }
            }
            if (ok) out.push(e);
        }

        return out;
    }
}
