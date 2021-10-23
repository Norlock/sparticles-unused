import {Cell} from "./cell"
import {Particle} from "./particle"
import {Point} from "./position"

export interface Options {
  probabilityXCount: number
  probabilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number
  coordinates: Point
}

export class Probability {
  particle: Particle
  cell: Cell
}

export const createGrid = (options: Options) => {
  const {probabilityXCount, probabilityYCount, probabilityDiameter, cellXCount, cellYCount} = options
  const grid = createProbabilityGrid(probabilityXCount, probabilityYCount)

  const cellWidth = probabilityXCount * probabilityDiameter
  const cellHeight = probabilityYCount * probabilityDiameter
  const cells = createCellGrid(cellXCount, cellYCount, cellWidth, cellHeight)

  console.log('grid', grid)
  console.log('cells', cells)
}

const createProbabilityGrid = (probabilityXCount: number, probabilityYCount: number) => {
  const grid: Probability[][][] = []

  // Create probabilities
  for (let x = 0; x < probabilityXCount; x++) {
    let column: Probability[][] = []
    grid.push(column)

    for (let y = 0; y < probabilityYCount; y++) {
      column.push([])
    }
  }

  return grid
}

const createCellGrid = (cellXCount: number, cellYCount: number, cellWidth: number, cellHeight: number) => {
  const cells: Cell[][] = []

  for (let xIndex = 0; xIndex < cellXCount; xIndex++) {
    let column: Cell[] = []
    cells.push(column)

    for (let yIndex = 0; yIndex < cellYCount; yIndex++) {
      let x = xIndex * cellWidth
      let y = yIndex * cellHeight

      column.push(new Cell({x, y}))
    }
  }

  return cells
}
