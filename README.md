# just-an-ecs [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

⚠️ **Note:** This project is still in active development.  

- I will try **not to introduce breaking changes**, but please be aware that the API may evolve.  
- I apologize for initially starting at **version 1.x** instead of 0.x - this was premature, and I appreciate your understanding.  

Feel free to contribute, report issues, or suggest improvements!

---

- Github repo: <https://github.com/Arse09/just-an-ecs>
- Npm package: <https://www.npmjs.com/package/@arse09/just-an-ecs>

## Install

Install the latest stable release:

``` bash
npm i @arse09/just-an-ecs@latest
```

Or, if you want to try the latest pre-release:

``` bash
npm i @arse09/just-an-ecs@next
```

## Getting started

### Components

Components are *data containers* attached to entities.
They store state but do not contain behavior.

``` typescript

import { Component, createComponent } from "@arse09/just-an-ecs";

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

// Components can also be "tag" components, which contain no data and are used to mark entities.
@createComponent
export class TestEmptyC extends Component { }

```

### Resources

Resources are *global data stores* accessible by all systems.
Unlike components, which are per-entity, resources exist only once and are ideal for things like time tracking, game state, or configuration data.

``` typescript

import { Resource, createResource } from "@arse09/just-an-ecs";

@createResource
export class TestTickR extends Resource<{ elapsedSec: number; deltaSec: number; lastSec: number }> {
    public elapsedSec = this.args.elapsedSec;
    public deltaSec = this.args.deltaSec;
    public lastSec = this.args.lastSec;
}

```

### Systems

Systems contain *the logic* of your game.
They query entities and resources, then update or process data each frame. Systems are executed in the order they are registered in the ECS.

``` typescript

import { System, createSystem } from "@arse09/just-an-ecs";

@createSystem
export class TestTickUpdaterS extends System {
    readonly res = this.ecs.queryRes(TestTickR);

    // Runs in the first ecs.update() before the update fn
    setup(): void {
        // Do something at the start
    }

    // Runs every ecs.update()
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


```

### ECS

The ECS (Entity Component System) is *the core* of your game engine.
It manages entities, components, resources, and systems, and handles updating systems every frame.

``` typescript

import { ECS } from "@arse09/just-an-ecs";

const ecs = new ECS();

// Register systems (executed in order)
ecs.registerSys(TestTickUpdaterS, TestMovementS);

// Register global resources
ecs.registerRes(
    { class: TestTickR, args: { elapsedSec: 0, deltaSec: 0, lastSec: performance.now() / 1000 } }
);

// Create an entity and add components
const entity = ecs.newEntity(
    { class: TestPositionC, args: { x: 0, y: 0 } },
    { class: TestVelocityC, args: { vx: 1, vy: 1 } },
    { class: TestEmptyC }
)

// Simple game loop
function gameLoop() {
    ecs.update();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

```

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
