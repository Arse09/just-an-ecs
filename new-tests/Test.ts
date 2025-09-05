/**
 * @author Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, createComponent } from "../src/Component";
import { ECS } from "../src/ECS"
import { Sys, SysInstance } from "../src/Sys";

// Components

@createComponent
export class TestPositionC extends Component<{ x: number; y: number }> {
    public x = this.args.x;
    public y = this.args.y;
}

@createComponent
export class TestVelocityC extends Component<{ vx: number; vy: number }> {
    public x = this.args.vx;
    public y = this.args.vy;
}

@createComponent
export class TestEmptyC extends Component<void> { }

// Systems
export class TestMovementS extends Sys implements SysInstance {
    readonly query = this.ecs.query(TestPositionC, TestVelocityC);
    readonly res = this.ecs.queryRes();

    update(): void {
        for (const entity of this.query) {
            const pos = entity.write(TestPositionC, true);
            const vel = entity.read(TestVelocityC, true);

            pos.x += vel.x * this.res.ticker.delta;
            pos.y += vel.y * this.res.ticker.delta;
        }
    }
}

// ECS

const ecs = new ECS();

ecs.registerSys(new TestMovementS)

const asd = ecs.newEntity(
    { class: TestPositionC, args: { x: 0, y: 0 } },
    { class: TestEmptyC },
)
