import {Position} from "./position"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Grid} from "./grid"
import {Particle, ParticleAttributes} from "./particle"

export const fillParticles = (grid: Grid, attributes: ParticleAttributes, factory: GraphicalEntityFactory) => {
  const {cellWidth, cellHeight} = grid
  const {cellXCount, cellYCount, probabilityDiameter: distance} = grid.options

  const width = cellXCount * cellWidth
  const height = cellYCount * cellHeight

  const topHorizontalLeft = (count: number) => {
    for (let y = 0; y < width && 0 < count; y += distance) {
      for (let x = 0; x < height && 0 < count; x += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const topHorizontalRight = (count: number) => {
    for (let y = 0; y < height && 0 < count; y += distance) {
      for (let x = width - distance; 0 <= x && 0 < count; x -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const topVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const topVerticalRight = (count: number) => {
    for (let x = width - distance; 0 < x && 0 < count; x -= distance) {
      for (let y = 0; y < height && 0 < count; y += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const bottomHorizontalLeft = (count: number) => {
    for (let y = height - distance; 0 < y && 0 < count; y -= distance) {
      for (let x = 0; x < width && 0 < count; x += distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const bottomHorizontalRight = (count: number) => {
    for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
      for (let x = width - distance; 0 <= x && 0 < count; x -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const bottomVerticalLeft = (count: number) => {
    for (let x = 0; x < width && 0 < count; x += distance) {
      for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  const bottomVerticalRight = (count: number) => {
    for (let x = width - distance; 0 < x && 0 < count; x -= distance) {
      for (let y = height - distance; 0 <= y && 0 < count; y -= distance) {
        addParticle(new Position({x, y}))
        count--
      }
    }

    grid.editor.update()
  }

  // TODO improve duplicated tries
  const blueNoise = (particlePerCell: number) => {
    const fillCell = (cellX: number, cellY: number) => {

      const fill = (remainder: number) => {
        let x = cellX + Math.floor(Math.random() * cellWidth)
        let y = cellY + Math.floor(Math.random() * cellHeight)

        const spot = grid.getSpot(x, y)
        let current = spot.list.head

        while (current) {
          if (current.cell === spot.cell) {
            fill(remainder)
            return
          }

          current = current.next
        }

        addParticle(new Position({x, y}))

        if (0 < --remainder) {
          fill(remainder)
        }
      }

      fill(particlePerCell)
    }

    for (let x = 0; x < cellXCount; x++) {
      for (let y = 0; y < cellYCount; y++) {
        fillCell(x * cellWidth, y * cellHeight)
      }
    }

    grid.editor.update()
  }

  const addParticle = (position: Position) => {
    grid.addParticle(new Particle({
      position,
      attributes,
      factory
    }))
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
