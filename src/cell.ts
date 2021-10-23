export interface CellOptions {
  x: number
  y: number
}

export class Cell {
  readonly x: number
  readonly y: number

  constructor(options: CellOptions) {
    this.x = options.x
    this.y = options.y
  }
}
