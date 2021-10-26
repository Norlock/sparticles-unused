import {Particle} from "src/particle"
import {Force} from "../force"

export const bouncingBalls = (_particle: Particle) => {
  const force1: Force = {
    vx: 1,
    vy: 1,
    frameIteration: 4,
    delay: 0
  }

  const force2: Force = {
    vx: 0,
    vy: -1,
    frameIteration: 2,
    delay: 1
  }

  const force3: Force = {
    vx: -1,
    vy: 0,
    frameIteration: 2,
    delay: 2
  }

  return [force1, force2, force3]

}
