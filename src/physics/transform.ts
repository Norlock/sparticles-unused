import {Particle} from '../particle'

// TODO collission detection can futureX, futureY take place?
// If not where should it move to?
export const applyTransform = (particle: Particle): void => {
  particle.x += particle.vx
  particle.y += particle.vy

  particle.graphicalEntity.mesh.x = particle.x
  particle.graphicalEntity.mesh.y = particle.y
}
