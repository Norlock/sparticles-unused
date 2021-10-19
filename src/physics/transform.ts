import {Cell} from 'src/cell'
import {Particle} from '../particle'

export const applyTransform = (cell: Cell, particle: Particle) => {
  const {graphicalEntity, coordinates} = particle

  const futureX = coordinates.x + coordinates.vx
  const futureY = coordinates.y + coordinates.vy

  const newCell = cell.selector.getCell(futureX, futureY)

  if (newCell) {
    coordinates.x = futureX
    coordinates.y = futureY

    graphicalEntity.mesh.x = coordinates.x
    graphicalEntity.mesh.y = coordinates.y

    if (newCell !== cell) {
      newCell.particles.add(particle)
    }
  }
}
