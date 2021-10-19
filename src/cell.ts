import {CellSelector} from './cellSelector'
import {List} from './list'
import {ListFactory} from './listFactory'
// Cells will add particles

export interface CellOptions {
  x: number
  y: number
  xIndex: number
  yIndex: number
  cellSelector: CellSelector,
  factory: ListFactory
}

export class Cell {
  readonly x: number
  readonly y: number
  readonly xIndex: number
  readonly yIndex: number
  readonly selector: CellSelector
  readonly particles: List

  constructor(options: CellOptions) {
    this.x = options.x
    this.y = options.y
    this.xIndex = options.xIndex
    this.yIndex = options.yIndex
    this.selector = options.cellSelector
    this.particles = options.factory.create(this)
  }
}
