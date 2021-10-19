export class Coordinates implements Point {
  x: number
  y: number
  z?: number
  vx = 0
  vy = 0
  vz?: number

  constructor(x: number, y: number, z?: number) {
    this.x = x
    this.y = y
    this.z = z
  }
}

export interface Point {
  x: number,
  y: number
  z?: number
}
