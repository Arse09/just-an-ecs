/**
 * @original MIT code fireveined (OLDLICENSE.md)
 * @contributor Arse09
 * @license MIT (LICENSE.md)
 */

export { getComponentsHashFromInitializators } from "./ComponentGroupHash";
export { EntityViewFactory } from "./EntityViewFactory";
export { System, type SystemEntityType } from "./System";
export { createResource, Resource } from "./Resource"
export { Sys, type SysInstance } from "./Sys";
export { Entity } from "./Entity";
export { Component, type ComponentInitializator, makeComponent, createComponent, type EntityOf } from "./Component";
export { ECS } from "./ECS";

import "./Archetype";
import "./ComponentGroupHash";
import "./ComponentGroup";

import "./ComponentGroupRegistry";
import "./SystemRegistry";