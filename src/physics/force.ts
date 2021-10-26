import {Particle} from "../particle"

export interface Force {
  vx?: number
  vy?: number
  frameIteration: number
}

export const applyForce = (particle: Particle, force: Force) => {
  if (force.vx) {
    particle.position.vx = force.vx
  }

  if (force.vy) {
    particle.position.vy = force.vy
  }
}
