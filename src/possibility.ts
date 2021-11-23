import {Grid} from "./grid"
import {Particle} from "./particle"

export class Possibility {
  particle: Particle
  next?: Possibility
  inQueue: boolean

  readonly cellXIndex: number
  readonly cellYIndex: number

  constructor(grid: Grid, particle: Particle, inQueue: boolean) {
    this.particle = particle
    this.inQueue = inQueue
    this.cellXIndex = grid.getCellXIndex(this.particle.x)
    this.cellYIndex = grid.getCellYIndex(this.particle.y)
  }
}

