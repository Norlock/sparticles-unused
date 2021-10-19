import {Point} from "./coordinates";
import {Particle} from "./particle";

export interface GraphicalEntity {
  mesh: Point
  transform: () => void
}

export interface GraphicalEntityFactory {
  create(particle: Particle): GraphicalEntity
}
