import {Grid} from 'src/grid'
import {Particle} from '../particle'

// TODO collission detection can futureX, futureY take place?
// If not where should it move to?
export const applyTransform = (grid: Grid, particle: Particle): void => {
  particle.graphicalEntity.mesh.x = particle.position.x
  particle.graphicalEntity.mesh.y = particle.position.y
  //const {graphicalEntity, position: coordinates} = particle
  //const next = particle.next

  //const futureX = coordinates.x + coordinates.vx
  //const futureY = coordinates.y + coordinates.vy

  //const newCell = cell.selector.getCell(futureX, futureY)

  //if (newCell) {
  //coordinates.x = futureX
  //coordinates.y = futureY

  //graphicalEntity.mesh.x = coordinates.x
  //graphicalEntity.mesh.y = coordinates.y

  //if (newCell !== cell) {
  //cell.particles.remove(particle)
  //newCell.particles.add(particle)
  //}
  //}
}

