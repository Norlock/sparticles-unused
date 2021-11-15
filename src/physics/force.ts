import {Particle} from "../particle"
import {ExternalForce} from "./externalForces"

export interface Force {
  vx?: number
  vy?: number
  vz?: number
  vxStart?: number
  vyStart?: number
  vzStart?: number
  vxLimit?: number
  vyLimit?: number
  vzLimit?: number
  firstFrame: number
  lastFrame: number
}

export type ApplyForces = (particle: Particle) => Force[]

export const applyInternalForces = (particle: Particle) => {

  const internalForce = particle.forces.find(
    x => x.firstFrame <= particle.frame && particle.frame <= x.lastFrame)

  if (internalForce) {
    applyInternalForce(particle, internalForce)
  }

  if (particle.frame === particle.lastFrame) {
    particle.frame = 0
  } else {
    particle.frame++
  }
}

export const applyAllForces = (particle: Particle, externalForce: ExternalForce) => {

  const internalForce = particle.forces.find(
    x => x.firstFrame <= particle.frame && particle.frame <= x.lastFrame)

  if (internalForce) {
    applyInternalForce(particle, internalForce)
  }

  externalForce.applyForce(particle)

  if (particle.frame === particle.lastFrame) {
    particle.frame = 0
  } else {
    particle.frame++
  }
}

const applyInternalForce = (particle: Particle, force: Force) => {
  if (force.firstFrame === particle.frame) {
    if (typeof force.vxStart === "number") {
      particle.vx = force.vxStart
    }
    if (typeof force.vyStart === "number") {
      particle.vy = force.vyStart
    }
    if (typeof force.vzStart === "number") {
      particle.vz = force.vzStart
    }
    return
  }

  if (force.vx) {
    const newVX = particle.vx + force.vx

    if (0 < force.vx) {
      particle.vx = Math.min(newVX, force.vxLimit)
    } else if (force.vx < 0) {
      particle.vx = Math.max(newVX, force.vxLimit)
    }
  }

  if (force.vy) {
    const newVY = particle.vy + force.vy

    if (0 < force.vy) {
      particle.vy = Math.min(newVY, force.vyLimit)
    } else if (force.vy < 0) {
      particle.vy = Math.max(newVY, force.vyLimit)
    }
  }

  if (force.vz) {
    const newVZ = particle.vz + force.vz

    if (0 < force.vz) {
      particle.vz = Math.min(newVZ, force.vzLimit)
    } else if (force.vz < 0) {
      particle.vz = Math.max(newVZ, force.vzLimit)
    }
  }
}
