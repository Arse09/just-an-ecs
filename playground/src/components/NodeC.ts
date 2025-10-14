import {Component, createComponent} from "@arse09/just-an-ecs";


@createComponent
export default class NodeC extends Component<{ it: HTMLElement }> {
    public it = this.args.it;
}