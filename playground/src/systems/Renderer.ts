import {createSystem, System} from "@arse09/just-an-ecs";
import NodeC from "../components/NodeC.ts";
import Position from "../components/Position.ts";


@createSystem
export default class Renderer extends System {
    readonly query = this.ecs.query(Position, NodeC);

    public update() {
        for (const entity of this.query) {
            const pos = entity.read(Position, true);
            const node = entity.write(NodeC, true);

            node.it.style.left = `${pos.x}px`;
            node.it.style.top = `${pos.y}px`;
        }
    }
}