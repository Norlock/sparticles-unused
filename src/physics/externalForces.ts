// static means the force is applied to each particle (e.g. falling down)

import {Grid} from "src/grid";
import {Particle} from "src/particle";
import {handleCollision} from "./collision";
import {applyAllForces, applyInternalForces} from "./force";
import {Direction} from "./lineCaster";
import {applyTransform} from "./transform";

// dynamic means the force collides with particles and have residual effect (e.g. wind blowing)  
type ForceType = "static" | "dynamic"

export class BaseForce {
  vx: number;
  vy: number;
  vz?: number;
}

// TODO in future you can apply external force on partial space inside the grid
export class ExternalForce extends BaseForce {
  firstFrame: number;
  lastFrame: number;
  type: ForceType

  updateParticle: (particle: Particle) => void
}

export const applyExternalForce = (grid: Grid, force: ExternalForce) => {
  if (0 < force.vx) {
    if (0 < force.vy) {
      return Direction.TOP_LEFT
    } else if (force.vy < 0) {
      return Direction.BOTTOM_LEFT
    } else {
      force.updateParticle = (particle) => updateParticleLeftForce(force, particle)
      prepareForceFromLeft(grid, force)
      return
    }
  } else if (force.vx < 0) {
    if (0 < force.vy) {
      return Direction.TOP_RIGHT
    } else if (force.vy < 0) {
      return Direction.BOTTOM_RIGHT
    } else {
      force.updateParticle = (particle) => updateParticleRightForce(force, particle)
      return Direction.RIGHT
    }
  } else {
    if (0 < force.vy) {
      return Direction.TOP
    } else {
      return Direction.BOTTOM
    }
  }
}

const updateParticleLeftForce = (self: ExternalForce, particle: Particle) => {
  if (particle.vx < self.vx) {
    particle.vx = Math.min(particle.vx + self.vx, self.vx)
  }
}

const updateParticleRightForce = (self: ExternalForce, particle: Particle) => {
  if (self.vx < particle.vx) {
    particle.vx = Math.max(particle.vx + self.vx, self.vx)
  }
}

interface ParticleRow {
  y?: number
  x?: number
  particles: Particle[]
}

const prepareForceFromLeft = (grid: Grid, force: ExternalForce) => {
  const loopRow = (x: number, y: number, rows: ParticleRow[]) => {
    const spot = grid.getPossibilitySpot(x, y)
    let current = spot.head

    while (current) {
      if (current.inQueue === true) {
        current.inQueue = false
        current = current.next
        continue
      }

      const match = rows.find(x => x.y === current.cell.y)

      if (match) {
        match.particles.push(current.particle)
      } else {
        rows.push({
          particles: [current.particle],
          y: current.cell.y
        })
      }

      current = current.next
    }

    if (x < grid.possibilityXCount - 1) {
      loopRow(x + 1, y, rows)
    } else {
      // applyForces
      for (let row of rows) {
        row.particles.sort((a, b) => a.x - b.x)
        applyForceFromLeft(grid, force, row)
      }
    }
  }

  for (let y = 0; y < grid.possibilityYCount; y++) {
    loopRow(0, y, [])
  }
}

interface HorizontalArea {
  xStart: number
  xEnd: number
}

interface VerticalArea {
  yStart: number
  yEnd: number
}

const mergeVerticalShieldedAreas = (shieldedAreas: VerticalArea[]) => {
  if (shieldedAreas.length < 2) return

  for (let i = 1; i < shieldedAreas.length; i++) {
    const current = shieldedAreas[i]
    const previous = shieldedAreas[i - 1]

    if (previous.yStart <= current.yStart && current.yStart <= previous.yEnd
      || previous.yStart <= current.yEnd && current.yEnd <= previous.yEnd) {
      previous.yStart = Math.min(previous.yStart, current.yStart)
      previous.yEnd = Math.max(previous.yEnd, current.yEnd)
      shieldedAreas.splice(i--)
    }
  }
}

const isVerticallyShielded = (shieldedAreas: VerticalArea[], index: number, particle: Particle) => {
  if (index === shieldedAreas.length) {
    shieldedAreas.push({
      yStart: particle.y,
      yEnd: particle.y + particle.diameter
    })
    return false
  }

  const area = shieldedAreas[index]

  if (shieldedTop(particle, area)) {
    if (!shieldedBottom(particle, area)) {
      area.yEnd = particle.y + particle.diameter
      // for now partial hit will be handled as fully shielded
    }
    return true
  } else if (shieldedBottom(particle, area)) {
    area.yStart = particle.y
    // for now partial hit will be handled as fully shielded
    return true
  } else {
    isVerticallyShielded(shieldedAreas, index + 1, particle)
  }
}

const applyForceFromLeft = (grid: Grid, force: ExternalForce, row: ParticleRow) => {
  const shieldedAreas: VerticalArea[] = []

  const updateCurrent = (index: number) => {
    const particle = row.particles[index]

    if (isVerticallyShielded(shieldedAreas, 0, particle)) {
      applyInternalForces(particle)
      mergeVerticalShieldedAreas(shieldedAreas)
    } else {
      applyAllForces(particle, force)
    }

    handleCollision(grid, grid.getSpot(particle.x, particle.y), particle)
    applyTransform(particle)

    if (index < row.particles.length - 1) {
      updateCurrent(index + 1)
    }
  }

  if (0 < row.particles.length) {
    updateCurrent(0)
  }
}

const shieldedTop = (particle: Particle, shieldArea: VerticalArea) => {
  return shieldArea.yStart <= particle.y && particle.y <= shieldArea.yEnd
}

const shieldedBottom = (particle: Particle, shieldArea: VerticalArea) => {
  const particleYEnd = particle.y + particle.diameter
  return shieldArea.yStart <= particleYEnd && particleYEnd <= shieldArea.yEnd
}
