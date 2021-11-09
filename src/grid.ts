import {Cell} from "./cell"
import {fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {ProbabilityList} from "./list"
import {Particle, ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"
import {handleCollision} from "./physics/collision"
import {applyTransform} from "./physics/transform"
import {applyForces} from "./physics/force"
import {Point} from "./position"
import {Probability} from "./probability"
import {Editor, editor} from "./editor/ui"
import {ExternalForce} from "./physics/externalForces"
import {Direction, LineTree} from "./physics/lineCaster"

type UpdateSpot = (list: ProbabilityList) => void

export interface GridOptions {
  probabilityXCount: number
  probabilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number
  position: Point
  showUI: boolean
  forces?: ExternalForce[]
}

export interface Spot {
  cell: Cell,
  list: ProbabilityList
}

export class Grid {
  probabilitySpots: ProbabilityList[][]
  cells: Cell[][]
  cellWidth: number
  cellHeight: number
  gridWidth: number
  gridHeight: number
  probabilityXCount: number
  probabilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number

  container: ParticleContainer
  isRendering = false
  particleCount = 0
  editor: Editor
  forces: ExternalForce[]
  lastFrame: number
  frame = 0

  constructor(options: GridOptions, factory: ParticleContainerFactory) {
    const {probabilityXCount, probabilityYCount,
      cellXCount, cellYCount, probabilityDiameter, position, forces} = options

    this.cellWidth = probabilityXCount * probabilityDiameter
    this.cellHeight = probabilityYCount * probabilityDiameter
    this.gridWidth = cellXCount * this.cellWidth
    this.gridHeight = cellYCount * this.cellHeight
    this.forces = forces ?? []
    this.probabilityXCount = probabilityXCount
    this.probabilityYCount = probabilityYCount
    this.probabilityDiameter = probabilityDiameter
    this.cellXCount = cellXCount
    this.cellYCount = cellYCount

    this.lastFrame = this.forces.reduce(
      (last, current) => Math.max(last, current.lastFrame), 0
    )

    this.probabilitySpots = createProbabilityGrid(probabilityXCount, probabilityYCount)
    this.cells = createCellGrid(this)
    this.container = factory.create(position)

    if (options.showUI === true) {
      this.container.drawDevGrid(options)
      this.editor = editor(this)
    }
  }

  addParticle(particle: Particle) {
    addParticle(this, particle)
  }

  fill(attributes: ParticleAttributes, factory: GraphicalEntityFactory) {
    return fillParticles(this, attributes, factory)
  }

  getSpot(x: number, y: number): Spot {
    if (x < 0 || this.gridWidth <= x
      || y < 0 || this.gridHeight <= y) {
      return
    }

    const xIndex = Math.floor(x / this.cellWidth)
    const yIndex = Math.floor(y / this.cellHeight)

    const cell = this.cells[xIndex][yIndex]

    const {cellWidth, cellHeight, probabilityDiameter} = this

    const xResidual = x % cellWidth
    const yResidual = y % cellHeight

    const probabilityX = Math.floor(xResidual / probabilityDiameter)
    const probabilityY = Math.floor(yResidual / probabilityDiameter)

    const list = this.probabilitySpots[probabilityX][probabilityY]

    return {cell, list}
  }

  start() {
    start(this)
  }

  stop() {
    this.isRendering = false
  }
}

const start = (self: Grid) => {
  self.isRendering = true

  const render = () => {
    //console.time()
    if (self.isRendering) {
      requestAnimationFrame(render)
      setLooper(self)
      self.container.render()
    }
    //console.timeEnd()
  }

  render()
}

const setLooper = (self: Grid) => {
  const tree = createTree(self)
  const update = updateCB(self, tree)

  if (!tree) {
    return horizontalTopLoopFromLeft(self, update)
  }

  switch (tree.direction) {
    case Direction.TOP:
      return verticalTopLoopFromLeft(self, update)
    case Direction.LEFT:
      return horizontalTopLoopFromLeft(self, update)
    case Direction.RIGHT:
      return horizontalTopLoopFromRight(self, update)
    case Direction.BOTTOM:
      return verticalTopLoopFromLeft(self, update)
    default:
      console.error("not implemented yet")
      break;
  }
}

const updateCB = (self: Grid, tree?: LineTree) => {
  let finishUpdate: (particle: Particle) => void

  if (tree) {
    finishUpdate = (particle: Particle) => tree.add(particle)
  } else {
    finishUpdate = applyTransform
  }

  const update = (list: ProbabilityList) => {
    let current = list.head

    while (current) {
      if (current.inQueue === true) {
        current.inQueue = false
        current = current.next
        continue
      }

      const {particle, cell} = current
      applyForces(particle)
      handleCollision(self, {list, cell}, particle)
      finishUpdate(particle)

      current = current.next
    }
  }

  return update
}

const createTree = (self: Grid) => {
  let tree: LineTree

  for (let force of self.forces) {
    if (force.firstFrame <= self.frame && self.frame <= force.lastFrame) {
      tree = new LineTree(force, self.gridWidth, self.gridHeight)
      break
    }
  }

  if (self.frame === self.lastFrame) {
    self.frame = 0
  } else {
    self.frame++
  }

  return tree
}

const createProbabilityGrid = (probabilityXCount: number, probabilityYCount: number) => {
  const grid: ProbabilityList[][] = []

  // Create probabilities
  for (let x = 0; x < probabilityXCount; x++) {
    let column: ProbabilityList[] = []
    grid.push(column)

    for (let y = 0; y < probabilityYCount; y++) {
      column.push(new ProbabilityList())
    }
  }

  return grid
}

const createCellGrid = (self: Grid) => {
  const cells: Cell[][] = []
  const {cellWidth, cellHeight, cellXCount, cellYCount} = self

  for (let xIndex = 0; xIndex < cellXCount; xIndex++) {
    let column: Cell[] = []
    cells.push(column)

    for (let yIndex = 0; yIndex < cellYCount; yIndex++) {
      let x = xIndex * cellWidth
      let y = yIndex * cellHeight

      column.push(new Cell({x, y}))
    }
  }

  return cells
}

const addParticle = (self: Grid, particle: Particle) => {
  const {cellWidth, cellHeight, probabilityDiameter} = self
  self.particleCount++

  const spot = self.getSpot(particle.x, particle.y)
  const {cell} = spot
  const xResidual = particle.x % cellWidth
  const yResidual = particle.y % cellHeight

  const probabilityX = Math.floor(xResidual / probabilityDiameter)
  const probabilityY = Math.floor(yResidual / probabilityDiameter)

  // TODO dev var just for lining out particles
  particle.x = cell.x + probabilityX * probabilityDiameter + (probabilityDiameter / 2)
  particle.y = cell.y + probabilityY * probabilityDiameter + (probabilityDiameter / 2)

  self.probabilitySpots[probabilityX][probabilityY].add(new Probability(particle, cell, false))
  self.container.add(particle)
}

const verticalTopLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let x = 0; x < self.probabilityXCount; x++) {
    for (let y = 0; y < self.probabilityYCount; y++) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const verticalTopLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let x = self.probabilityYCount - 1; 0 <= x; x--) {
    for (let y = 0; y < self.probabilityYCount; y++) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const verticalBottomLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let x = 0; x < self.probabilityXCount; x++) {
    for (let y = self.probabilityYCount - 1; 0 <= y; y--) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const verticalBottomLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let x = self.probabilityYCount - 1; 0 <= x; x--) {
    for (let y = self.probabilityYCount - 1; 0 <= y; y--) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const horizontalTopLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let y = 0; y < self.probabilityYCount; y++) {
    for (let x = 0; x < self.probabilityXCount; x++) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const horizontalTopLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let y = self.probabilityYCount - 1; 0 <= y; y--) {
    for (let x = 0; x < self.probabilityXCount; x++) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const horizontalBottomLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let y = self.probabilityYCount - 1; 0 <= y; y--) {
    for (let x = 0; x < self.probabilityXCount; x++) {
      update(self.probabilitySpots[x][y])
    }
  }
}

const horizontalBottomLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let y = self.probabilityYCount - 1; 0 <= y; y--) {
    for (let x = self.probabilityYCount - 1; 0 <= x; x--) {
      update(self.probabilitySpots[x][y])
    }
  }
}
