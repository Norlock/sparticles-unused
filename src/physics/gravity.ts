import {Particle} from "../particle"
import {Cell} from "src/cell"

export const applyGravity = (_cell: Cell, particle: Particle) => {
  particle.position.vy = 1 == particle.position.vy ? 1 : particle.position.vy + 1
}

// TODO
// callback function for iteration
