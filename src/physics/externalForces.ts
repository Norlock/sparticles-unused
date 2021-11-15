// static means the force is applied to each particle (e.g. falling down)

import {Grid} from "src/grid";
import {Particle} from "src/particle";
import {handleCollision} from "./collision";
import {applyForces} from "./force";
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
  //x: number;
  //y: number;
  //z?: number;
  //width: number;
  //height: number;

  // dispersion if set will start from a point and disperse in percentage over length

  firstFrame: number;
  lastFrame: number;
  type: ForceType
}

export const applyExternalForce = (grid: Grid, force: ExternalForce) => {
  if (0 < force.vx) {
    if (0 < force.vy) {
      return Direction.TOP_LEFT
    } else if (force.vy < 0) {
      return Direction.BOTTOM_LEFT
    } else {
      return prepareForceFromLeft(grid, force)
    }
  } else if (force.vx < 0) {
    if (0 < force.vy) {
      return Direction.TOP_RIGHT
    } else if (force.vy < 0) {
      return Direction.BOTTOM_RIGHT
    } else {
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

interface ShieldedArea {
  yStart: number
  yEnd: number
}

const applyForceFromLeft = (grid: Grid, force: ExternalForce, row: ParticleRow) => {
  const shieldedAreas: ShieldedArea[] = []

  const updateCurrent = (index: number) => {
    const particle = row.particles[index]
    let shielded = false

    for (let shieldArea of shieldedAreas) {
      if (shieldedTop(particle, shieldArea)) {
        shielded = true
        if (!shieldedBottom(particle, shieldArea)) {
          shieldArea.yEnd = particle.y + particle.diameter
          // TODO partial collision 
          // for now partial will be handled as full shielded
        }
      } else if (shieldedBottom(particle, shieldArea)) {
        shielded = true
        shieldArea.yStart = particle.y
        // TODO partial collision
        // for now partial will be handled as full shielded
      }
    }

    if (!shielded) {
      shieldedAreas.push({
        yStart: particle.y,
        yEnd: particle.y + particle.diameter
      })
      particle.vx = Math.min(particle.vx + force.vx, force.vx)
    }

    applyForces(particle)
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

const shieldedTop = (particle: Particle, shieldArea: ShieldedArea) => {
  return shieldArea.yStart <= particle.y && particle.y <= shieldArea.yEnd
}

const shieldedBottom = (particle: Particle, shieldArea: ShieldedArea) => {
  const particleYEnd = particle.y + particle.diameter
  return shieldArea.yStart <= particleYEnd && particleYEnd <= shieldArea.yEnd
}
