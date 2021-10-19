import {Particle} from "./particle";

export interface GraphicalEntity {
  mesh: any
  transform: () => void
}

export interface GraphicalEntityFactory {
  create(particle: Particle): GraphicalEntity
}
