# just-an-ecs [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Components

``` typescript

@createComponent
export class PositionC extends Component<{ x: number; y: number }> {
    public x = this.args.x;
    public y = this.args.y;
}

@createComponent
export class VelocityC extends Component<{ vx: number; vy: number }> {
    public x = this.args.vx;
    public y = this.args.vy;
}

@createComponent
export class EmptyC extends Component<void> { }

```

## Systems

``` typescript

export class TestMovementS extends Sys implements SysInstance {
    readonly query = this.ecs.query(TestPositionC, TestVelocityC);
    readonly res = this.ecs.queryRes(); // Experimental. Only has Ticker right now;

    update(): void {
        for (const entity of this.query) {
            const pos = entity.write(TestPositionC, true);
            const vel = entity.read(TestVelocityC, true);

            pos.x += vel.x * this.res.ticker.delta;
            pos.y += vel.y * this.res.ticker.delta;
        }
    }


```

## ECS

``` typescript

const ecs = new ECS();

ecs.registerSys(new TestMovementS)

const entity = ecs.newEntity(
    { class: TestPositionC, args: { x: 0, y: 0 } },
    { class: TestEmptyC },
)

```

## License

This project contains code originally authored by fireveined (see OLDLICENSE.md)  
All modifications and new code by Arse09 are licensed under the MIT License.
