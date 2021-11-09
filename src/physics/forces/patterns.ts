import {Particle} from "src/particle"
import {Force} from "../force"

export const fireflies = (particle: Particle) => {

  particle.frame = Math.floor(Math.random() * 60)

  if (Math.random() <= 0.5) {
    return directionLeft()
  } else {
    return directionRight()
  }
}

const directionLeft = () => {
  const vxLimit = Math.random() * 3
  const vyLimit = Math.random() * 3

  const force1: Force = {
    vx: 1,
    vy: 1,
    vxLimit: vxLimit,
    vyLimit: vyLimit,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 0,
    lastFrame: 19
  }

  const force2: Force = {
    vx: -1,
    vxLimit: -vxLimit,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 20,
    lastFrame: 39
  }

  const force3: Force = {
    vy: -1,
    vyLimit: -vyLimit,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 40,
    lastFrame: 59
  }

  return [force1, force2, force3]
}

const directionRight = () => {
  const vxLimit = Math.random() * 1.5
  const vyLimit = Math.random() * 1.5

  const force1: Force = {
    vx: -1,
    vy: -1,
    vxLimit: -vxLimit,
    vyLimit: -vyLimit,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 0,
    lastFrame: 19
  }

  const force2: Force = {
    vx: 1,
    vxLimit: vxLimit,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 20,
    lastFrame: 39
  }

  const force3: Force = {
    vy: 1,
    vyLimit: vyLimit,
    vxStart: 0,
    vyStart: 0,
    firstFrame: 40,
    lastFrame: 59
  }

  return [force3, force2, force1]
}
