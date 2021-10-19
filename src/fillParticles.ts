import {Coordinates} from "./coordinates"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Grid} from "./grid"
import {Particle, ParticleAttributes} from "./particle"

export const fillParticles = (grid: Grid, attributes: ParticleAttributes, factory: GraphicalEntityFactory) => {
  const distance = attributes.spacing + attributes.diameter
  const {width, height} = grid.options

  const topHorizontalLeft = (count: number) => {
    for (let y = 0; y < height && 0 < count; y += distance) {
      for (let x = 0; x < width && 0 < count; x += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const topHorizontalRight = (count: number) => {
    for (let y = 0; y < height && 0 < count; y += distance) {
      for (let x = width - 1; 0 < x && 0 < count; x -= distance) {
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
    for (let x = width - 1; 0 < x && 0 < count; x -= distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomHorizontalLeft = (count: number) => {
    for (let y = height - 1; 0 < y && 0 < count; y -= distance) {
      for (let x = 0; x < width && 0 < count; x += distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomHorizontalRight = (count: number) => {
    for (let y = height - 1; y < height && 0 < count; y -= distance) {
      for (let x = width - 1; 0 < x && 0 < count; x -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = height - 1; 0 < y && 0 < count; y -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const bottomVerticalRight = (count: number) => {
    for (let x = width - 1; 0 < x && 0 < count; x -= distance) {
      for (let y = height - 1; 0 < y && 0 < count; y -= distance) {
        addParticle(new Coordinates(x, y))
        count--
      }
    }
  }

  const addParticle = (coordinates: Coordinates) => {
    const particle = new Particle({
      coordinates,
      attributes,
      factory
    })
    grid.particles.push(particle)
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
