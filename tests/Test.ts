/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, createComponent } from "../src/index";
import { Resource, createResource } from "../src/index";
import { System, createSystem } from "../src/index";
import { ECS } from "../src/index";

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

// ECS

const ecs = new ECS();

ecs.registerSys(TestTickUpdaterS, TestMovementS);

ecs.registerRes(
    { class: TestTickR, args: { elapsedSec: 0, deltaSec: 0, lastSec: performance.now() / 1000 } },
);


const entity = ecs.newEntity(
    { class: TestPositionC, args: { x: 0, y: 0 } },
    { class: TestVelocityC, args: { vx: 1, vy: 1 } },
    { class: TestEmptyC },
)


function gameLoop() {
    ecs.update();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);