/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

export { getComponentsHashFromInitializators } from "./ComponentGroupHash"
export { EntityViewFactory } from "./EntityViewFactory";
export { System, SystemEntityType } from "./System";
export { Sys, type SysInstance } from "./Sys";
export { Entity } from "./Entity";
export { Component, ComponentInitializator, makeComponent, createComponent, EntityOf } from "./Component";
export { ECS } from "./ECS";

import "./Archetype";
import "./ComponentGroupHash";
import "./ComponentGroup";

import "./ComponentGroupRegistry";
import "./SystemRegistry";