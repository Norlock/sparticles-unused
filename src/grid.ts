import {Coordinates} from "./coordinates"
import {FillAttributes, FillStyle} from "./fillAttributes"
import {fill, fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Particle, ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"

export interface GridOptions {
  width: number
  height: number
  coordinates: Coordinates
  factory: ParticleContainerFactory
}

export class Grid {
  options: GridOptions
  isRendering = false
  particles: Particle[] = []
  container: ParticleContainer

  start: () => void
  constructor(options: GridOptions) {
    this.options = options
    this.start = () => start(this)
    this.container = options.factory.create(options.coordinates)
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

    console.log('test', this)
  }
}

const start = (self: Grid) => {
  self.isRendering = true

  const render = () => {
    if (self.isRendering) {
      requestAnimationFrame(render)

      self.container.render()
    }
  }

  render()
}
