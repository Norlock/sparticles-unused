import {Particle} from "../particle"

export const applyGravity = (particle: Particle) => {
  particle.position.vy = 1
  // TODO better calculation
}
