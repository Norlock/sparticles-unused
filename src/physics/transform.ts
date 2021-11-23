import {Particle} from 'src/particle'

export const applyTransform = (particle: Particle): void => {
  particle.x += particle.vx
  particle.y += particle.vy

  particle.graphicalEntity.mesh.x = particle.x
  particle.graphicalEntity.mesh.y = particle.y
}
