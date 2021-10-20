import {Cell} from './cell'
import {Grid} from './grid'


export interface CellSelector {
  getAbove(current: Cell): Cell
  getBelow(current: Cell): Cell
  getLeft(current: Cell): Cell
  getRight(current: Cell): Cell
  getCell(x: number, y: number): Cell
}

export const cellSelector = (grid: Grid): CellSelector => {
  const {cellXCount, cellYCount, cellDiameter} = grid.options

  const getAbove = (current: Cell): Cell => {
    if (0 < current.yIndex) {
      return grid.cells[current.xIndex][current.yIndex - 1]
    }
  }

  const getBelow = (current: Cell): Cell => {
    if (current.yIndex < cellYCount) {
      return grid.cells[current.xIndex][current.yIndex + 1]
    }
  }

  const getLeft = (current: Cell): Cell => {
    if (0 < current.xIndex) {
      return grid.cells[current.xIndex - 1][current.yIndex]
    }
  }

  const getRight = (current: Cell): Cell => {
    if (current.xIndex < cellXCount) {
      return grid.cells[current.xIndex + 1][current.yIndex]
    }
  }

  const getCell = (x: number, y: number) => {
    const xIndex = Math.floor(x / cellDiameter)
    const yIndex = Math.floor(y / cellDiameter)

    if (0 <= xIndex && xIndex < cellXCount
      && 0 <= yIndex && yIndex < cellYCount) {
      return grid.cells[xIndex][yIndex]
    }
  }

  return {
    getAbove,
    getBelow,
    getLeft,
    getRight,
    getCell
  }
}
