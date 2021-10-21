import {Cell} from 'src/cell'
import {Particle} from '../particle'

// TODO collission detection can futureX, futureY take place?
// If not where should it move to?
// Should it respect spacing, is there a minimum spacing and maximum spacing?
export const applyTransform = (cell: Cell, particle: Particle): Particle => {
  const {graphicalEntity, position: coordinates} = particle
  const next = particle.next

  const futureX = coordinates.x + coordinates.vx
  const futureY = coordinates.y + coordinates.vy

  const newCell = cell.selector.getCell(futureX, futureY)

  if (newCell) {
    coordinates.x = futureX
    coordinates.y = futureY

    graphicalEntity.mesh.x = coordinates.x
    graphicalEntity.mesh.y = coordinates.y

    if (newCell !== cell) {
      cell.particles.remove(particle)
      newCell.particles.add(particle)
    }
  }

  return next
}

