export interface PositionOptions {
  x: number,
  y: number,
  z?: number,
  vx?: number,
  vy?: number
  vz?: number
}

export class Position implements Point {
  x: number
  y: number
  z?: number
  vx: number
  vy: number
  vz?: number

  constructor(options: PositionOptions) {
    this.x = options.x
    this.y = options.y
    this.z = options.z
    this.vx = options.vx ?? 0
    this.vy = options.vy ?? 0
    this.vz = options.vz
  }
}

export interface Point {
  x: number
  y: number
  z?: number
}
