import {Cell} from "./cell"
import {Particle} from "./particle"

export class Probability {
  particle: Particle
  cell: Cell
  next?: Probability

  constructor(particle: Particle, cell: Cell) {
    this.particle = particle
    this.cell = cell
  }
}

