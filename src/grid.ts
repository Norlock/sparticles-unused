import {Cell} from "./cell"
import {cellSelector} from "./cellSelector"
import {Coordinates} from "./coordinates"
import {FillAttributes, FillStyle} from "./fillAttributes"
import {fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {ParticleLinkedListFactory} from "./listFactory"
import {ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"
import {applyGravity} from "./physics/gravity"
import {applyTransform} from "./physics/transform"

export interface GridOptions {
  cellXCount: number
  cellYCount: number
  cellDiameter: number
  coordinates: Coordinates
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

  addParticles(fillAttributes: FillAttributes, attributes: ParticleAttributes, factory: GraphicalEntityFactory) {
    const fill = fillParticles(this, attributes, factory)
    switch (fillAttributes.fillStyle) {
      case FillStyle.TOP_HORIZONTAL_LEFT:
        fill.topHorizontalLeft(fillAttributes.particleCount)
        break
      case FillStyle.TOP_HORIZONTAL_RIGHT:
        fill.topHorizontalRight(fillAttributes.particleCount)
        break
      case FillStyle.TOP_VERTICAL_LEFT:
        fill.topVerticalLeft(fillAttributes.particleCount)
        break
      case FillStyle.TOP_VERTICAL_RIGHT:
        fill.topVerticalRight(fillAttributes.particleCount)
        break
      case FillStyle.BOTTOM_HORIZONTAL_LEFT:
        fill.bottomHorizontalLeft(fillAttributes.particleCount)
        break
      case FillStyle.BOTTOM_HORIZONTAL_RIGHT:
        fill.bottomHorizontalRight(fillAttributes.particleCount)
        break
      case FillStyle.BOTTOM_VERTICAL_LEFT:
        fill.bottomVerticalLeft(fillAttributes.particleCount)
        break
      case FillStyle.BOTTOM_VERTICAL_RIGHT:
        fill.bottomVerticalRight(fillAttributes.particleCount)
        break
      //case FillStyle.WHITE_NOISE:
      //fillWhiteNoise(self)
      //break
      //case FillStyle.BLUE_NOISE:
      //fillBlueNoise(self, particleAmount)
      //break
      default:
        throw new Error("unknown fillstyle")
    }
  }
}

const start = (self: Grid) => {
  self.isRendering = true

  const callbacks = [applyGravity, applyTransform]

  const render = () => {
    if (self.isRendering) {
      requestAnimationFrame(render)

      //self.cells.forEach(cellColumn => {
      //cellColumn.forEach(cell => {
      //cell.particles.iterate(callbacks)
      //})
      //})

      self.container.render()
    }
  }

  render()
}
