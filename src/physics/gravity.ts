import {Particle} from "../particle"

export const applyGravity = (particle: Particle) => {
  particle.position.vy = 2
  // TODO better calculation
}
