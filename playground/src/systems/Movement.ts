import {createSystem, System} from "@arse09/just-an-ecs";
import Position from "../components/Position.ts";


@createSystem
export default class Movement extends System {
    readonly query = this.ecs.query(Position);

    public update() {
        for (const entity of this.query) {
            const pos = entity.write(Position, true);

            pos.x += 1;
            pos.y += 1;
        }
    }
}