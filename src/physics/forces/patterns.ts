import {Particle} from "src/particle"
import {Force} from "../force"

export const bouncingBalls = (particle: Particle) => {
  const force1: Force = {
    vx: 1,
    vy: 1,
    vxBoundry: 2,
    vyBoundry: 2,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 0,
    lastFrame: 19
  }

  const force2: Force = {
    vx: -1,
    vxBoundry: -2,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 20,
    lastFrame: 39
  }

  const force3: Force = {
    vy: -1,
    vyBoundry: -2,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 40,
    lastFrame: 59
  }

  particle.frame = Math.floor(Math.random() * force3.lastFrame)

  return [force1, force2, force3]
}
