// static means the force is applied to each particle (e.g. falling down)

import {Grid} from "src/grid";
import {PossibilityList} from "src/list";
import {Particle} from "src/particle";
import {Possibility} from "src/possibility";
import {handleCollision} from "./collision";
import {applyAllForces, applyInternalForces} from "./force";
import {Direction} from "./lineCaster";
import {applyTransform} from "./transform";

// dynamic means the force collides with particles and that shields the particles behind (e.g. wind blowing)  
// static is used for instance for gravity where it will be applied to all 
// particles no matter the position
type ForceType = "static" | "dynamic"

export interface ExternalForceOptions {
  firstFrame: number;
  lastFrame: number;
  type: ForceType
  vx: number;
  vy: number;
  vz?: number;
}

// TODO in future you can apply external force on partial space inside the grid, maybe
export class ExternalForce {
  firstFrame: number;
  lastFrame: number;
  type: ForceType
  vx: number;
  vy: number;
  vz?: number;

  updateParticle: (particle: Particle, fraction: number) => void
  apply: () => void

  constructor(grid: Grid, options: ExternalForceOptions) {
    this.firstFrame = options.firstFrame
    this.lastFrame = options.lastFrame
    this.type = options.type
    this.vx = options.vx
    this.vy = options.vy
    this.vz = options.vz
    setForceFunctions(grid, this)
  }
}

const setForceFunctions = (grid: Grid, self: ExternalForce) => {
  if (0 < self.vx) {
    if (0 < self.vy) {
      return Direction.TOP_LEFT
    } else if (self.vy < 0) {
      return Direction.BOTTOM_LEFT
    } else {
      self.updateParticle = (particle, fraction) => updateParticleLeftForce(self, particle, fraction)
      self.apply = () => prepareForceFromLeft(grid, self)
      return
    }
  } else if (self.vx < 0) {
    if (0 < self.vy) {
      return Direction.TOP_RIGHT
    } else if (self.vy < 0) {
      return Direction.BOTTOM_RIGHT
    } else {
      self.updateParticle = (particle, fraction) => updateParticleRightForce(self, particle, fraction)
      self.apply = () => prepareForceFromRight(grid, self)
      return
    }
  } else {
    if (0 < self.vy) {
      self.updateParticle = (particle, fraction) => updateParticleTopForce(self, particle, fraction)
      self.apply = () => prepareForceFromTop(grid, self)
      return
    } else {
      self.updateParticle = (particle, fraction) => updateParticleBottomForce(self, particle, fraction)
      self.apply = () => prepareForceFromBottom(grid, self)
      return
    }
  }
}

const updateParticleLeftForce = (self: ExternalForce, particle: Particle, fraction: number) => {
  if (particle.vx < self.vx) {
    particle.vx = Math.min(particle.vx + (self.vx * fraction), self.vx)
  }
}

const updateParticleRightForce = (self: ExternalForce, particle: Particle, fraction: number) => {
  if (self.vx < particle.vx) {
    particle.vx = Math.max(particle.vx + (self.vx * fraction), self.vx)
  }
}

const updateParticleTopForce = (self: ExternalForce, particle: Particle, fraction: number) => {
  if (particle.vy < self.vy) {
    particle.vy = Math.min(particle.vy + (self.vy * fraction), self.vy)
  }
}

const updateParticleBottomForce = (self: ExternalForce, particle: Particle, fraction: number) => {
  if (self.vy < particle.vy) {
    particle.vy = Math.max(particle.vy + (self.vy * fraction), self.vy)
  }
}

interface ParticleRow {
  y?: number
  x?: number
  particles: Particle[]
}

const iterateSpot = (list: PossibilityList, cb: (current: Possibility) => void) => {
  let current = list.head

  while (current) {
    if (current.inQueue === true) {
      current.inQueue = false
      current = current.next
      continue
    }

    cb(current)
    current = current.next
  }
}

const prepareForceFromLeft = (grid: Grid, force: ExternalForce) => {
  const loopRow = (x: number, y: number, rows: ParticleRow[]) => {
    const callback = (current: Possibility) => addParticleToRowSplitVertically(rows, current)
    iterateSpot(grid.getPossibilityList(x, y), callback)

    if (x < grid.possibilityXCount - 1) {
      loopRow(x + 1, y, rows)
    } else {
      for (let row of rows) {
        row.particles.sort((a, b) => a.x - b.x)
        applyHorizontalForce(grid, force, row)
      }
    }
  }

  for (let y = 0; y < grid.possibilityYCount; y++) {
    loopRow(0, y, [])
  }
}

const prepareForceFromRight = (grid: Grid, force: ExternalForce) => {
  const loopRow = (x: number, y: number, rows: ParticleRow[]) => {
    const callback = (current: Possibility) => addParticleToRowSplitVertically(rows, current)
    iterateSpot(grid.getPossibilityList(x, y), callback)

    if (0 < x) {
      loopRow(x - 1, y, rows)
    } else {
      for (let row of rows) {
        row.particles.sort((a, b) => b.x - a.x)
        applyHorizontalForce(grid, force, row)
      }
    }
  }

  const startX = grid.possibilityXCount - 1
  for (let y = 0; y < grid.possibilityYCount; y++) {
    loopRow(startX, y, [])
  }
}

const prepareForceFromTop = (grid: Grid, force: ExternalForce) => {
  const loopRow = (x: number, y: number, rows: ParticleRow[]) => {
    const callback = (current: Possibility) => addParticleToRowSplitHorizontally(rows, current)
    iterateSpot(grid.getPossibilityList(x, y), callback)

    if (y < grid.possibilityYCount - 1) {
      loopRow(x, y + 1, rows)
    } else {
      for (let row of rows) {
        row.particles.sort((a, b) => a.y - b.y)
        applyVerticalForce(grid, force, row)
      }
    }
  }

  for (let x = 0; x < grid.possibilityXCount; x++) {
    loopRow(x, 0, [])
  }
}

const prepareForceFromBottom = (grid: Grid, force: ExternalForce) => {
  const loopRow = (x: number, y: number, rows: ParticleRow[]) => {
    const callback = (current: Possibility) => addParticleToRowSplitHorizontally(rows, current)
    iterateSpot(grid.getPossibilityList(x, y), callback)

    if (0 < y) {
      loopRow(x, y - 1, rows)
    } else {
      for (let row of rows) {
        row.particles.sort((a, b) => b.y - a.y)
        applyVerticalForce(grid, force, row)
      }
    }
  }

  const y = grid.possibilityYCount - 1
  for (let x = 0; x < grid.possibilityXCount; x++) {
    loopRow(x, y, [])
  }
}

const applyHorizontalForce = (grid: Grid, force: ExternalForce, row: ParticleRow) => {
  const shieldedAreas: VerticalArea[] = []

  const updateCurrent = (index: number) => {
    const particle = row.particles[index]

    const fraction = isVerticallyShielded(shieldedAreas, 0, particle)
    if (0 === fraction) {
      applyInternalForces(particle)
    } else {
      applyAllForces(particle, force, fraction)
    }

    mergeVerticalShieldedAreas(shieldedAreas)
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

const applyVerticalForce = (grid: Grid, force: ExternalForce, row: ParticleRow) => {
  const shieldedAreas: HorizontalArea[] = []

  const updateCurrent = (index: number) => {
    const particle = row.particles[index]

    const fraction = isHorizontallyShielded(shieldedAreas, 0, particle)
    if (0 === fraction) {
      applyInternalForces(particle)
    } else {
      applyAllForces(particle, force, fraction)
    }

    mergeHorizontalShieldedAreas(shieldedAreas)
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

const addParticleToRowSplitVertically = (rows: ParticleRow[], current: Possibility) => {
  const match = rows.find(x => x.y === current.cell.y)

  if (match) {
    match.particles.push(current.particle)
  } else {
    rows.push({
      particles: [current.particle],
      y: current.cell.y
    })
  }
}

const addParticleToRowSplitHorizontally = (rows: ParticleRow[], current: Possibility) => {
  const match = rows.find(particle => particle.x === current.cell.x)

  if (match) {
    match.particles.push(current.particle)
  } else {
    rows.push({
      particles: [current.particle],
      x: current.cell.x
    })
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

const mergeHorizontalShieldedAreas = (shieldedAreas: HorizontalArea[]) => {
  if (shieldedAreas.length < 2) return

  for (let i = 1; i < shieldedAreas.length; i++) {
    const current = shieldedAreas[i]
    const previous = shieldedAreas[i - 1]

    if (previous.xStart <= current.xStart && current.xStart <= previous.xEnd
      || previous.xStart <= current.xEnd && current.xEnd <= previous.xEnd) {
      previous.xStart = Math.min(previous.xStart, current.xStart)
      previous.xEnd = Math.max(previous.xEnd, current.xEnd)
      shieldedAreas.splice(i--)
    }
  }
}

const isVerticallyShielded = (shieldedAreas: VerticalArea[], index: number, particle: Particle): number => {
  if (index === shieldedAreas.length) {
    shieldedAreas.push({
      yStart: particle.y,
      yEnd: particle.y + particle.diameter
    })
    return 1
  }

  const area = shieldedAreas[index]

  if (shieldedTop(particle, area)) {
    if (shieldedBottom(particle, area)) {
      return 0
    } else {
      const particleYEnd = particle.y + particle.diameter
      const residual = particleYEnd - area.yEnd
      area.yEnd = particleYEnd
      return residual / particle.diameter
    }
  } else if (shieldedBottom(particle, area)) {
    const residual = area.yStart - particle.y
    area.yStart = particle.y
    return residual / particle.diameter
  } else {
    return isVerticallyShielded(shieldedAreas, index + 1, particle)
  }
}

const isHorizontallyShielded = (shieldedAreas: HorizontalArea[], index: number, particle: Particle): number => {
  if (index === shieldedAreas.length) {
    shieldedAreas.push({
      xStart: particle.x,
      xEnd: particle.x + particle.diameter
    })
    return 1
  }

  const area = shieldedAreas[index]

  if (shieldedLeft(particle, area)) {
    if (shieldedRight(particle, area)) {
      return 0
    } else {
      const particleXEnd = particle.x + particle.diameter
      const residual = particleXEnd - area.xEnd
      area.xEnd = particleXEnd
      return residual / particle.diameter
    }
  } else if (shieldedRight(particle, area)) {
    const residual = area.xStart - particle.x
    area.xStart = particle.x
    return residual / particle.diameter
  } else {
    return isHorizontallyShielded(shieldedAreas, index + 1, particle)
  }
}

const shieldedTop = (particle: Particle, shieldArea: VerticalArea) => {
  return shieldArea.yStart <= particle.y && particle.y <= shieldArea.yEnd
}

const shieldedBottom = (particle: Particle, shieldArea: VerticalArea) => {
  const particleYEnd = particle.y + particle.diameter
  return shieldArea.yStart <= particleYEnd && particleYEnd <= shieldArea.yEnd
}

const shieldedLeft = (particle: Particle, shieldArea: HorizontalArea) => {
  return shieldArea.xStart <= particle.x && particle.x <= shieldArea.xEnd
}

const shieldedRight = (particle: Particle, shieldArea: HorizontalArea) => {
  const particleXEnd = particle.x + particle.diameter
  return shieldArea.xStart <= particleXEnd && particleXEnd <= shieldArea.xEnd
}
