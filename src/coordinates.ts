export class Coordinates {
  x: number
  y: number
  z?: number
  vx: number
  vy: number
  vz?: number

  constructor(x: number, y: number, z?: number) {
    this.x = x
    this.y = y
    this.z = z
  }
}
