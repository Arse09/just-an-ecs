import {Component, createComponent} from "@arse09/just-an-ecs";

@createComponent
export default class Position extends Component<{ x: number, y: number }> {
    public x = this.args.x;
    public y = this.args.y;
}