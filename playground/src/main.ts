import './style.css'

import {ECS} from '@arse09/just-an-ecs'
import Position from './components/Position.ts'
import Movement from "./systems/Movement.ts";
import NodeC from "./components/NodeC.ts";
import Renderer from "./systems/Renderer.ts";

const my_ecs = new ECS();

my_ecs.newEntity(
    {class: Position, args: {x: 0, y: 0}},
    {class: NodeC, args: {it: document.getElementById("box")!}}
);

my_ecs.registerSys(Movement, Renderer);

function loop() {
    my_ecs.update();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);