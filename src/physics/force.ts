import {Particle} from "../particle"

export interface Force {
  vx?: number
  vy?: number
  vz?: number
  vxLimit?: number
  vyLimit?: number
  vzLimit?: number
  // Start can be used to avoid offset
  vxStart?: number
  vyStart?: number
  vzStart?: number
  firstFrame: number
  lastFrame: number
}

export type ApplyForces = (particle: Particle) => Force[]

export const applyForces = (particle: Particle) => {
  particle.forces.forEach(force => {
    if (force.firstFrame <= particle.frame && particle.frame <= force.lastFrame) {
      applyForce(particle, force)
    }
  })

  if (particle.frame === particle.lastFrame) {
    particle.frame = 0
  } else {
    particle.frame++
  }
}

export const applyForce = (particle: Particle, force: Force) => {

  if (particle.frame === force.firstFrame) {
    if (typeof force.vxStart === 'number')
      particle.vx = force.vxStart
    if (typeof force.vyStart === 'number')
      particle.vy = force.vyStart
    if (typeof force.vzStart === 'number')
      particle.vz = force.vzStart
    return
  }

  if (force.vx) {
    const newVX = particle.vx + force.vx

    if (0 < force.vx) {
      if (newVX <= force.vxLimit) {
        particle.vx = newVX
      } else {
        particle.vx = force.vxLimit
      }
    } else if (force.vx < 0) {
      if (force.vxLimit <= newVX) {
        particle.vx = newVX
      } else {
        particle.vx = force.vxLimit
      }
    }
  }

  if (force.vy) {
    const newVY = particle.vy + force.vy

    if (0 < force.vy) {
      if (newVY <= force.vyLimit) {
        particle.vy = newVY
      } else {
        particle.vy = force.vyLimit
      }
    } else if (force.vy < 0) {
      if (force.vyLimit <= newVY) {
        particle.vy = newVY
      } else {
        particle.vy = force.vyLimit
      }
    }
  }

  if (force.vz) {
    const newVZ = particle.vz + force.vz

    if (0 < force.vz) {
      if (newVZ <= force.vzLimit) {
        particle.vz = newVZ
      } else {
        particle.vz = force.vzLimit
      }
    } else if (force.vz < 0) {
      if (force.vzLimit <= newVZ) {
        particle.vz = newVZ
      } else {
        particle.vz = force.vzLimit
      }
    }
  }
}
