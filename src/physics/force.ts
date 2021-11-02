import {Particle} from "../particle"

export interface Force {
  vx?: number
  vy?: number
  vz?: number
  vxBoundry?: number
  vyBoundry?: number
  vzBoundry?: number
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
      if (newVX <= force.vxBoundry) {
        position.vx = newVX
      } else {
        position.vx = force.vxBoundry
      }
    } else if (force.vx < 0) {
      if (force.vxBoundry <= newVX) {
        position.vx = newVX
      } else {
        position.vx = force.vxBoundry
      }
    }
  }

  if (force.vy) {
    const newVY = position.vy + force.vy

    if (0 < force.vy) {
      if (newVY <= force.vyBoundry) {
        position.vy = newVY
      } else {
        position.vy = force.vyBoundry
      }
    } else if (force.vy < 0) {
      if (force.vyBoundry <= newVY) {
        position.vy = newVY
      } else {
        position.vy = force.vyBoundry
      }
    }
  }

  if (force.vz) {
    const newVZ = position.vz + force.vz

    if (0 < force.vz) {
      if (newVZ <= force.vzBoundry) {
        position.vz = newVZ
      } else {
        position.vz = force.vzBoundry
      }
    } else if (force.vz < 0) {
      if (force.vzBoundry <= newVZ) {
        position.vz = newVZ
      } else {
        position.vz = force.vzBoundry
      }
    }
  }
}
