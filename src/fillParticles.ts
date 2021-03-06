import {Position} from "./position"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Grid} from "./grid"
import {Particle, ParticleAttributes} from "./particle"
import {ApplyForces} from "./physics/force"

export const fillParticles = (grid: Grid, attributes: ParticleAttributes, factory: GraphicalEntityFactory) => {
  const {cellWidth, cellHeight, cellXCount, cellYCount, possibilityDiameter} = grid

  const width = cellXCount * cellWidth
  const height = cellYCount * cellHeight

  const topHorizontalLeft = (count: number, applyForces: ApplyForces) => {
    for (let y = 0; y < width && 0 < count; y += possibilityDiameter) {
      for (let x = 0; x < height && 0 < count; x += possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const topHorizontalRight = (count: number, applyForces: ApplyForces) => {
    for (let y = 0; y < height && 0 < count; y += possibilityDiameter) {
      for (let x = width - possibilityDiameter; 0 <= x && 0 < count; x -= possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const topVerticalLeft = (count: number, applyForces: ApplyForces) => {
    for (let x = 0; x < width && 0 < count; x += possibilityDiameter) {
      for (let y = 0; y < height && 0 < count; y += possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const topVerticalRight = (count: number, applyForces: ApplyForces) => {
    for (let x = width - possibilityDiameter; 0 < x && 0 < count; x -= possibilityDiameter) {
      for (let y = 0; y < height && 0 < count; y += possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const bottomHorizontalLeft = (count: number, applyForces: ApplyForces) => {
    for (let y = height - possibilityDiameter; 0 < y && 0 < count; y -= possibilityDiameter) {
      for (let x = 0; x < width && 0 < count; x += possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const bottomHorizontalRight = (count: number, applyForces: ApplyForces) => {
    for (let y = height - possibilityDiameter; 0 <= y && 0 < count; y -= possibilityDiameter) {
      for (let x = width - possibilityDiameter; 0 <= x && 0 < count; x -= possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const bottomVerticalLeft = (count: number, applyForces: ApplyForces) => {
    for (let x = 0; x < width && 0 < count; x += possibilityDiameter) {
      for (let y = height - possibilityDiameter; 0 <= y && 0 < count; y -= possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  const bottomVerticalRight = (count: number, applyForces: ApplyForces) => {
    for (let x = width - possibilityDiameter; 0 < x && 0 < count; x -= possibilityDiameter) {
      for (let y = height - possibilityDiameter; 0 <= y && 0 < count; y -= possibilityDiameter) {
        addParticle(new Position({x, y}), applyForces)
        count--
      }
    }

    grid.editor?.update()
  }

  // TODO improve duplicated tries
  const blueNoise = (particlePerCell: number, applyForces?: ApplyForces) => {
    const fillCell = (cellX: number, cellY: number) => {

      const fill = (remainder: number) => {
        let x = cellX + Math.floor(Math.random() * cellWidth)
        let y = cellY + Math.floor(Math.random() * cellHeight)

        const spot = grid.getSpot(x, y)

        if (spot.possibility) {
          fill(remainder)
          return
        }

        addParticle(new Position({x, y}), applyForces)

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

    grid.editor?.update()
  }

  const addParticle = (position: Position, applyForces?: ApplyForces) => {
    grid.addParticle(new Particle({
      position,
      attributes,
      factory,
      applyForces
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
