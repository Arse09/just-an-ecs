# just-an-ecs

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

// Comming soon

```

## ECS

``` typescript

// Comming soon

```

## License

This project contains code originally authored by fireveined (see OLDLICENSE.md)  
All modifications and new code by Arse09 are licensed under the MIT License.
