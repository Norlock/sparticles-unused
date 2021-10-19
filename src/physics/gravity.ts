import {Particle} from "../particle"
import {Cell} from "src/cell"

export const applyGravity = (_cell: Cell, particle: Particle) => {
  particle.coordinates.vy = 1 == particle.coordinates.vy ? 1 : particle.coordinates.vy + 1
}

// TODO
// callback function for iteration
