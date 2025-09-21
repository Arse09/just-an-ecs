/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

import { Component, createComponent } from "../src";
import { Resource, createResource } from "../src";
import { System, createSystem } from "../src";

// Components
@createComponent
export class TestPositionC extends Component<{ x: number; y: number }> {
    public x = this.args.x;
    public y = this.args.y;
}

@createComponent
export class TestVelocityC extends Component<{ vx: number; vy: number }> {
    public vx = this.args.vx;
    public vy = this.args.vy;
}

@createComponent
export class TestEmptyC extends Component { }

// Resources
@createResource
export class TestTickR extends Resource<{ elapsedSec: number; deltaSec: number; lastSec: number }> {
    public elapsedSec = this.args.elapsedSec;
    public deltaSec = this.args.deltaSec;
    public lastSec = this.args.lastSec;
}

// Systems
@createSystem
export class TestTickUpdaterS extends System {
    readonly res = this.ecs.queryRes(TestTickR);

    update(): void {
        const tick = this.res.write(TestTickR, true);

        const nowSec = performance.now() / 1000;
        tick.deltaSec = nowSec - tick.lastSec;
        tick.elapsedSec += tick.deltaSec;
        tick.lastSec = nowSec;
    }
}

@createSystem
export class TestMovementS extends System {
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