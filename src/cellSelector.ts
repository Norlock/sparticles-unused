import {Cell} from './cell'
import {Grid} from './grid'


export interface CellSelector {
  getCell(x: number, y: number): Cell
}

export const cellSelector = (grid: Grid): CellSelector => {
  const {cellXCount, cellYCount} = grid.options

  const getCell = (x: number, y: number) => {
    const xIndex = Math.floor(x / grid.cellWidth)
    const yIndex = Math.floor(y / grid.cellHeight)

    if (0 <= xIndex && xIndex < cellXCount
      && 0 <= yIndex && yIndex < cellYCount) {
      return grid.cells[xIndex][yIndex]
    }
  }

  return {getCell}
}
