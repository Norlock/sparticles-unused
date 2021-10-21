import * as PIXI from "pixi.js"
import {Point} from "./position"
import {ParticleContainer, PixiParticleContainer} from "./particleContainer"

export interface ParticleContainerFactory {
  create(position: Point): ParticleContainer
}

export const PixiParticleContainerFactory = (renderer: PIXI.Renderer) => {
  const create = (position: Point): PixiParticleContainer => {
    return new PixiParticleContainer(position, renderer);
  }

  return {create}
}
