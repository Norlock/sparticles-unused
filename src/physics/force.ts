import {Particle} from "../particle"

export const applyForce = (particle: Particle, vx?: number, vy?: number) => {
  if (vx) {
    particle.position.vx = vx
  }

  if (vy) {
    particle.position.vy = vy
  }
}
