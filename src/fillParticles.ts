import {Coordinates} from "./coordinates"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Grid} from "./grid"
import {Particle, ParticleAttributes} from "./particle"

export const fillParticles = (grid: Grid, attributes: ParticleAttributes, factory: GraphicalEntityFactory) => {
  const distance = attributes.spacing + attributes.diameter
  const {cellXCount, cellYCount, cellDiameter} = grid.options

  const width = cellXCount * cellDiameter
  const height = cellYCount * cellDiameter

  const topHorizontalLeft = (count: number) => {
    for (let y = 0; y < width && 0 < count; y += distance) {
      for (let x = 0; x < height && 0 < count; x += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const topHorizontalRight = (count: number) => {
    for (let y = 0; y < height && 0 < count; y += distance) {
      for (let x = width - distance; 0 <= x && 0 < count; x -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const topVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const topVerticalRight = (count: number) => {
    for (let x = width - distance; 0 < x && 0 < count; x -= distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomHorizontalLeft = (count: number) => {
    for (let y = height - distance; 0 < y && 0 < count; y -= distance) {
      for (let x = 0; x < width && 0 < count; x += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomHorizontalRight = (count: number) => {
    for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
      for (let x = width - distance; 0 <= x && 0 < count; x -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomVerticalRight = (count: number) => {
    for (let x = width - distance; 0 < x && 0 < count; x -= distance) {
      for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const blueNoise = (count: number) => {

    for (let i = 0; i < count; i++) {

    }
  }

  const addParticle = (coordinates: Coordinates) => {
    const particle = new Particle({
      coordinates,
      attributes,
      factory
    })

    const xCell = Math.floor(coordinates.x / grid.options.cellDiameter)
    const yCell = Math.floor(coordinates.y / grid.options.cellDiameter)
    //console.log('cells', xCell, yCell, grid.cells[xCell][yCell])
    grid.cells[xCell][yCell].particles.add(particle)
    grid.container.add(particle)
  }

  return {
    topHorizontalLeft,
    topHorizontalRight,
    topVerticalLeft,
    topVerticalRight,
    bottomHorizontalLeft,
    bottomHorizontalRight,
    bottomVerticalLeft,
    bottomVerticalRight
  }
}
