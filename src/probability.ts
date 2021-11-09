import {Cell} from "./cell"
import {Particle} from "./particle"

export class Probability {
  particle: Particle
  cell: Cell
  next?: Probability
  inQueue: boolean

  constructor(particle: Particle, cell: Cell, inQueue: boolean) {
    this.particle = particle
    this.cell = cell
    this.inQueue = inQueue
  }
}

