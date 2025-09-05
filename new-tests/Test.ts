/**
 * @original Arse09
 * @license MIT (LICENSE.md)
 */

import { Component, createComponent } from "../src/Component";
import { ECS } from "../src/ECS"

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

const ecs = new ECS();

const asd = ecs.newEntity(
    { class: TestPositionC, args: { x: 0, y: 0 } },
    { class: TestEmptyC },
)

asd.addComponents({class: TestEmptyC})

const comp = asd.read(TestPositionC, true);