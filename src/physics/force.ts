import {Force} from "src/grid"
import {Particle} from "../particle"

export const applyForce = (particle: Particle, force: Force) => {
  if (force.vx) {
    particle.position.vx = force.vx
  }

  if (force.vy) {
    particle.position.vy = force.vy
  }
}
