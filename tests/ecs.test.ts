/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
    Component,
    createComponent,
    Resource,
    createResource,
    Sys,
    ECS,
} from '../src/index';

describe('ECS example integration', () => {
    let nowSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        nowSpy = vi.spyOn(performance, 'now');
    });

    afterEach(() => {
        nowSpy.mockRestore();
    });

    it('tick updater sets deltaSec and movement system moves entity accordingly', () => {

        // Components
        class TestPositionC extends Component<{ x: number; y: number }> {
            public x = this.args.x;
            public y = this.args.y;
        }
        createComponent(TestPositionC);

        class TestVelocityC extends Component<{ vx: number; vy: number }> {
            public vx = this.args.vx;
            public vy = this.args.vy;
        }
        createComponent(TestVelocityC);

        class TestEmptyC extends Component<void> { }
        createComponent(TestEmptyC);

        // Resource
        class TestTickR extends Resource<{ elapsedSec: number; deltaSec: number; lastSec: number }> {
            public elapsedSec = this.args.elapsedSec;
            public deltaSec = this.args.deltaSec;
            public lastSec = this.args.lastSec;
        }
        createResource(TestTickR);

        // Systems
        class TestTickUpdaterS extends Sys {
            readonly res = this.ecs.queryRes(TestTickR);
            update(): void {
                const tick = this.res.write(TestTickR, true);
                const nowSec = performance.now() / 1000;
                tick.deltaSec = nowSec - tick.lastSec;
                tick.elapsedSec += tick.deltaSec;
                tick.lastSec = nowSec;
            }
        }

        class TestMovementS extends Sys {
            readonly query = this.ecs.query(TestPositionC, TestVelocityC, TestEmptyC);
            readonly res = this.ecs.queryRes(TestTickR);

            update(): void {
                const tick = this.res.read(TestTickR, true);
                for (const entity of this.query) {
                    const pos = entity.write(TestPositionC, true);
                    const vel = entity.read(TestVelocityC, true);
                    pos.x += vel.vx * tick.deltaSec;
                    pos.y += vel.vy * tick.deltaSec;
                }
            }
        }

        const ecs = new ECS();
        ecs.registerSys(TestTickUpdaterS, TestMovementS);

        ecs.registerRes({
            class: TestTickR,
            args: { elapsedSec: 0, deltaSec: 0, lastSec: 1.0 },
        });

        const entity = ecs.newEntity(
            { class: TestPositionC, args: { x: 0, y: 0 } },
            { class: TestVelocityC, args: { vx: 1, vy: 1 } },
            { class: TestEmptyC },
        );

        nowSpy.mockReturnValue(2000);
        ecs.update();

        const tickAfter1 = ecs.queryRes(TestTickR).read(TestTickR, true);
        expect(tickAfter1.deltaSec).toBeCloseTo(1.0, 6);
        expect(tickAfter1.elapsedSec).toBeCloseTo(1.0, 6);
        expect(tickAfter1.lastSec).toBeCloseTo(2.0, 6);

        const posAfter1 = entity.read(TestPositionC, true);
        expect(posAfter1.x).toBeCloseTo(1.0, 6);
        expect(posAfter1.y).toBeCloseTo(1.0, 6);

        nowSpy.mockReturnValue(2500);
        ecs.update();

        const tickAfter2 = ecs.queryRes(TestTickR).read(TestTickR, true);
        expect(tickAfter2.deltaSec).toBeCloseTo(0.5, 6);
        expect(tickAfter2.elapsedSec).toBeCloseTo(1.5, 6);
        expect(tickAfter2.lastSec).toBeCloseTo(2.5, 6);

        const posAfter2 = entity.read(TestPositionC, true);
        expect(posAfter2.x).toBeCloseTo(1.5, 6);
        expect(posAfter2.y).toBeCloseTo(1.5, 6);
    });
});
