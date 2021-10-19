import * as PIXI from "pixi.js"
import {Coordinates} from "./coordinates"
import {ParticleContainer, PixiParticleContainer} from "./particleContainer"

export interface ParticleContainerFactory {
  create(coordinates: Coordinates): ParticleContainer
}

export const PixiParticleContainerFactory = (renderer: PIXI.Renderer) => {
  const create = (coordinates: Coordinates): PixiParticleContainer => {
    return new PixiParticleContainer(coordinates, renderer);
  }

  return {create}
}
