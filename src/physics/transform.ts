import {Particle} from '../particle'

// TODO collission detection can futureX, futureY take place?
// If not where should it move to?
export const applyTransform = (particle: Particle): void => {
  const {position} = particle

  position.x += position.vx
  position.y += position.vy

  particle.graphicalEntity.mesh.x = position.x
  particle.graphicalEntity.mesh.y = position.y
}
