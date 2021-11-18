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
  updateInternalForces(particle)
  updateFrameCounter(particle)
}

export const applyAllForces = (particle: Particle, externalForce: ExternalForce, fraction: number) => {
  updateInternalForces(particle)
  externalForce.updateParticle(particle, fraction)
  updateFrameCounter(particle)
}

const updateInternalForces = (particle: Particle) => {
  decayForces(particle)

  const internalForce = particle.forces.find(
    x => x.firstFrame <= particle.frame && particle.frame <= x.lastFrame)

  if (internalForce) {
    applyInternalForce(particle, internalForce)
  }
}

const updateFrameCounter = (particle: Particle) => {
  if (particle.frame === particle.lastFrame) {
    particle.frame = 0
  } else {
    particle.frame++
  }
}

// If there is a decay 
const decayForces = (particle: Particle) => {
  if (0 < particle.vx) {
    particle.vx = Math.max(0, particle.vx - particle.decay)
  } else if (particle.vx < 0) {
    particle.vx = Math.min(0, particle.vx + particle.decay)
  }

  if (0 < particle.vy) {
    particle.vy = Math.max(0, particle.vy - particle.decay)
  } else if (particle.vy < 0) {
    particle.vy = Math.min(0, particle.vy + particle.decay)
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
