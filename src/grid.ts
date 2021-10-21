import {Cell} from "./cell"
import {cellSelector} from "./cellSelector"
import {Point} from "./position"
import {ParticleLinkedListFactory} from "./listFactory"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"

export interface GridOptions {
  cellXCount: number
  cellYCount: number
  cellDiameter: number
  coordinates: Point
  factory: ParticleContainerFactory
}

export class Grid {
  options: GridOptions
  isRendering = false
  container: ParticleContainer
  cells: Cell[][] = []
  start = () => start(this)

  constructor(options: GridOptions) {
    this.options = options
    this.container = options.factory.create(options.coordinates)

    const {cellXCount, cellYCount, cellDiameter} = options
    const selector = cellSelector(this)

    for (let xIndex = 0; xIndex < cellXCount; xIndex++) {
      const cellColumn: Cell[] = []

      for (let yIndex = 0; yIndex < cellYCount; yIndex++) {
        cellColumn.push(new Cell({
          factory: ParticleLinkedListFactory(),
          x: xIndex * cellDiameter,
          y: yIndex * cellDiameter,
          xIndex,
          yIndex,
          cellSelector: selector
        }))
      }

      this.cells.push(cellColumn)
    }
  }

  stop() {
    this.isRendering = false
  }
}

const start = (self: Grid) => {
  self.isRendering = true

  const render = () => {
    if (self.isRendering) {
      requestAnimationFrame(render)

      self.cells.forEach(cellColumn => {
        cellColumn.forEach(cell => {
          cell.particles.update()
        })
      })

      self.container.render()
    }
  }

  render()

  setTimeout(() => {
    console.log('grid', self)
  }, 10000)
}
