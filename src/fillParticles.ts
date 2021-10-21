import {Point, Position} from "./position"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Grid} from "./grid"
import {Particle, ParticleAttributes} from "./particle"
import {Cell} from "./cell"

export const fillParticles = (grid: Grid, attributes: ParticleAttributes, factory: GraphicalEntityFactory) => {
  const distance = attributes.spacing + attributes.diameter
  const {cellXCount, cellYCount, cellDiameter} = grid.options

  const width = cellXCount * cellDiameter
  const height = cellYCount * cellDiameter

  const topHorizontalLeft = (count: number) => {
    for (let y = 0; y < width && 0 < count; y += distance) {
      for (let x = 0; x < height && 0 < count; x += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const topHorizontalRight = (count: number) => {
    for (let y = 0; y < height && 0 < count; y += distance) {
      for (let x = width - distance; 0 <= x && 0 < count; x -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const topVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const topVerticalRight = (count: number) => {
    for (let x = width - distance; 0 < x && 0 < count; x -= distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const bottomHorizontalLeft = (count: number) => {
    for (let y = height - distance; 0 < y && 0 < count; y -= distance) {
      for (let x = 0; x < width && 0 < count; x += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const bottomHorizontalRight = (count: number) => {
    for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
      for (let x = width - distance; 0 <= x && 0 < count; x -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const bottomVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  const bottomVerticalRight = (count: number) => {
    for (let x = width - distance; 0 < x && 0 < count; x -= distance) {
      for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }
  }

  // TODO improvement collision
  const blueNoise = (particlePerCell: number) => {
    const fillCell = (cellX: number, cellY: number) => {
      const points: Point[] = []

      const fill = (remainder: number) => {
        let x = cellX + Math.floor(Math.random() * cellDiameter)
        let y = cellY + Math.floor(Math.random() * cellDiameter)

        for (let point of points) {
          if (point.x === x && point.y === y) {
            fill(remainder)
            return
          }
        }

        const point: Point = {x, y}
        points.push(point)
        addParticle(point)

        if (0 < --remainder) {
          fill(remainder)
        }
      }

      fill(particlePerCell)
    }

    for (let x = 0; x < cellXCount; x++) {
      for (let y = 0; y < cellYCount; y++) {
        fillCell(x * cellDiameter, y * cellDiameter)
      }
    }
  }

  const addParticle = (position: Position) => {
    const particle = new Particle({
      coordinates: position,
      attributes,
      factory
    })

    const xCell = Math.floor(position.x / grid.options.cellDiameter)
    const yCell = Math.floor(position.y / grid.options.cellDiameter)
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
    bottomVerticalRight,
    blueNoise
  }
}
