import {Particle} from "../particle"

export interface Force {
  vx?: number
  vy?: number
  vz?: number
  delay: number
  frameIteration: number
}

export type ApplyForces = (particle: Particle) => Force[]

export const applyForce = (particle: Particle, frame: number) => {
  for (let force of particle.forces) {
    if ((frame - force.delay) % force.frameIteration === 0) {
      if (force.vx && Math.abs(particle.position.vx) < Math.abs(force.vx)) {
        particle.position.vx += force.vx
      }

      if (force.vy && Math.abs(particle.position.vy) < Math.abs(force.vy)) {
        particle.position.vy += force.vy
      }

      if (force.vz && Math.abs(particle.position.vz) < Math.abs(force.vz)) {
        particle.position.vz += force.vz
      }
    }
  }
}
