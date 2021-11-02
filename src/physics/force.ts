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
  const {position} = particle

  if (particle.frame === force.firstFrame) {
    if (typeof force.vxStart === 'number')
      position.vx = force.vxStart
    if (typeof force.vyStart === 'number')
      position.vy = force.vyStart
    if (typeof force.vzStart === 'number')
      position.vz = force.vzStart
    return
  }

  if (force.vx) {
    const newVX = position.vx + force.vx

    if (0 < force.vx) {
      if (newVX <= force.vxLimit) {
        position.vx = newVX
      } else {
        position.vx = force.vxLimit
      }
    } else if (force.vx < 0) {
      if (force.vxLimit <= newVX) {
        position.vx = newVX
      } else {
        position.vx = force.vxLimit
      }
    }
  }

  if (force.vy) {
    const newVY = position.vy + force.vy

    if (0 < force.vy) {
      if (newVY <= force.vyLimit) {
        position.vy = newVY
      } else {
        position.vy = force.vyLimit
      }
    } else if (force.vy < 0) {
      if (force.vyLimit <= newVY) {
        position.vy = newVY
      } else {
        position.vy = force.vyLimit
      }
    }
  }

  if (force.vz) {
    const newVZ = position.vz + force.vz

    if (0 < force.vz) {
      if (newVZ <= force.vzLimit) {
        position.vz = newVZ
      } else {
        position.vz = force.vzLimit
      }
    } else if (force.vz < 0) {
      if (force.vzLimit <= newVZ) {
        position.vz = newVZ
      } else {
        position.vz = force.vzLimit
      }
    }
  }
}
