import './style.css'

import {ECS} from '@arse09/just-an-ecs'
import {Vec2, Vec3} from '@arse09/just-an-ecs/extra';
import {Renderer} from "./systems/Renderer.ts";
import {Transform} from "./components/Transform.ts";
import {NodeElement} from "./components/NodeElement.ts";
import {Movement} from "./systems/Movement.ts";
import {KeyInputs} from "./resources/KeyInputs.ts";
import {KeyRegister} from "./systems/KeyRegister.ts";
import {App} from "./resources/App.ts";
import {Velocity} from "./components/Velocity.ts";

const my_ecs = new ECS();

my_ecs.registerRes(
    {class: App, args: document.querySelector("#app")},
    {class: KeyInputs, args: {set: new Set<string>()}},
)

my_ecs.registerSys(KeyRegister, Movement, Renderer);

my_ecs.newEntity(
    {class: NodeElement, args: document.querySelector("#box")},
    {class: Transform, args: {position: Vec3.new()}},
    {class: Velocity, args: Vec2.new()},
);

my_ecs.start();