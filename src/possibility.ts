import {Cell} from "./cell"
import {Particle} from "./particle"

export class Possibility {
  particle: Particle
  cell: Cell
  next?: Possibility
  inQueue: boolean

  constructor(particle: Particle, cell: Cell, inQueue: boolean) {
    this.particle = particle
    this.cell = cell
    this.inQueue = inQueue
  }
}

