import {Cell} from "./cell"
import {fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {PossibilityList} from "./list"
import {Particle, ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"
import {handleCollision} from "./physics/collision"
import {applyTransform} from "./physics/transform"
import {applyInternalForces} from "./physics/force"
import {Point} from "./position"
import {Possibility} from "./possibility"
import {Editor, editor, updateLoopTimer} from "./editor/ui"
import {applyExternalForce, ExternalForce} from "./physics/externalForces"

type UpdateSpot = (list: PossibilityList) => void

export interface GridOptions {
  possibilityXCount: number
  possibilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number
  position: Point
  showUI: boolean
  forces?: ExternalForce[]
}

export interface Spot {
  cell: Cell,
  list: PossibilityList
}

export class Grid {
  possibilitySpots: PossibilityList[]
  cells: Cell[]
  cellWidth: number
  cellHeight: number
  gridWidth: number
  gridHeight: number
  possibilityXCount: number
  possibilityYCount: number
  possibilityDiameter: number
  cellXCount: number
  cellYCount: number

  averageLoopTime?: number
  showUI: boolean

  container: ParticleContainer
  isRendering = false
  particleCount = 0
  editor: Editor
  forces: ExternalForce[]
  lastFrame: number
  frame = 0

  constructor(options: GridOptions, factory: ParticleContainerFactory) {
    const {possibilityXCount, possibilityYCount,
      cellXCount, cellYCount, probabilityDiameter, position, forces} = options

    this.cellWidth = possibilityXCount * probabilityDiameter
    this.cellHeight = possibilityYCount * probabilityDiameter
    this.gridWidth = cellXCount * this.cellWidth
    this.gridHeight = cellYCount * this.cellHeight
    this.forces = forces ?? []
    this.possibilityXCount = possibilityXCount
    this.possibilityYCount = possibilityYCount
    this.possibilityDiameter = probabilityDiameter
    this.cellXCount = cellXCount
    this.cellYCount = cellYCount

    this.lastFrame = this.forces.reduce(
      (last, current) => Math.max(last, current.lastFrame), 0
    )

    this.possibilitySpots = createProbabilityGrid(possibilityXCount, possibilityYCount)
    this.cells = createCellGrid(this)
    this.container = factory.create(position)

    this.showUI = options.showUI
    if (this.showUI === true) {
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

  getCell(xIndex: number, yIndex: number): Cell {
    return this.cells[yIndex * this.cellXCount + xIndex]
  }

  getPossibilityList(xIndex: number, yIndex: number) {
    return this.possibilitySpots[yIndex * this.possibilityXCount + xIndex]
  }

  getNeighbourhood(x: number, y: number, diameter: number) {
    const xResidual = x % this.cellWidth
    const yResidual = y % this.cellHeight
    const hasNewXSpot = this.possibilityDiameter < xResidual + diameter
    const hasNewYSpot = this.possibilityDiameter < yResidual + diameter

    const currentSpot = this.getSpot(x, y)
    if (!currentSpot) return

    const neighbours: Spot[] = [currentSpot]

    if (hasNewXSpot) {
      const newXSpot = this.getSpot(x + diameter, y)
      if (newXSpot)
        neighbours.push(newXSpot)

      if (hasNewYSpot) {
        const newXYSpot = this.getSpot(x + diameter, y + diameter)
        if (newXYSpot)
          neighbours.push(newXYSpot)
      }
    }

    if (hasNewYSpot) {
      const newYSpot = this.getSpot(x, y + diameter)
      if (newYSpot)
        neighbours.push(newYSpot)
    }

    return neighbours
  }

  getSpot(x: number, y: number): Spot {
    if (x < 0 || this.gridWidth <= x
      || y < 0 || this.gridHeight <= y) {
      return
    }

    const xIndex = Math.floor(x / this.cellWidth)
    const yIndex = Math.floor(y / this.cellHeight)

    const cell = this.getCell(xIndex, yIndex)

    const xResidual = x % this.cellWidth
    const yResidual = y % this.cellHeight

    const possibilityX = Math.floor(xResidual / this.possibilityDiameter)
    const possibilityY = Math.floor(yResidual / this.possibilityDiameter)

    const list = this.getPossibilityList(possibilityX, possibilityY)

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

  if (self.showUI) {
    let i = 0
    const render = () => {
      const start = performance.now()
      if (self.isRendering) {
        requestAnimationFrame(render)
        updateFrame(self)
      }

      if (++i % 30 === 0) {
        updateLoopTimer(performance.now() - start)
      }
    }
    render()
  } else {
    const render = () => {
      if (self.isRendering) {
        requestAnimationFrame(render)
        updateFrame(self)
      }
    }
    render()
  }
}

const updateFrame = (self: Grid) => {
  const externalForce = activeExternalForce(self)
  if (externalForce) {
    applyExternalForce(self, externalForce)
  } else {
    horizontalTopLoopFromLeft(self, updateCB(self))
  }
  self.container.render()
}

export const updateCB = (self: Grid) => {
  const update = (list: PossibilityList) => {
    let current = list.head

    while (current) {
      if (current.inQueue === true) {
        current.inQueue = false
        current = current.next
        continue
      }

      const {particle, cell} = current
      applyInternalForces(particle)
      handleCollision(self, {list, cell}, particle)
      applyTransform(particle)

      current = current.next
    }
  }

  return update
}

const activeExternalForce = (self: Grid) => {
  let activeForce: ExternalForce

  for (let force of self.forces) {
    if (force.firstFrame <= self.frame && self.frame <= force.lastFrame) {
      activeForce = force
      break
    }
  }

  if (self.frame === self.lastFrame) {
    self.frame = 0
  } else {
    self.frame++
  }
  return activeForce
}

const createProbabilityGrid = (probabilityXCount: number, probabilityYCount: number) => {
  const grid: PossibilityList[] = []

  // Create probabilities
  for (let y = 0; y < probabilityYCount; y++) {
    for (let x = 0; x < probabilityXCount; x++) {
      grid.push(new PossibilityList())
    }
  }

  return grid
}

const createCellGrid = (self: Grid) => {
  const cells: Cell[] = []
  const {cellWidth, cellHeight, cellXCount, cellYCount} = self

  for (let yIndex = 0; yIndex < cellYCount; yIndex++) {
    for (let xIndex = 0; xIndex < cellXCount; xIndex++) {
      let x = xIndex * cellWidth
      let y = yIndex * cellHeight

      cells.push(new Cell({x, y}))
    }
  }

  return cells
}

const addParticle = (self: Grid, particle: Particle) => {
  const {cellWidth, cellHeight, possibilityDiameter} = self
  self.particleCount++

  const spot = self.getSpot(particle.x, particle.y)
  const {cell} = spot
  const xResidual = particle.x % cellWidth
  const yResidual = particle.y % cellHeight

  const possibilityX = Math.floor(xResidual / possibilityDiameter)
  const possibilityY = Math.floor(yResidual / possibilityDiameter)

  // TODO dev var just for lining out particles
  //particle.x = cell.x + possibilityX * possibilityDiameter + (possibilityDiameter / 2)
  //particle.y = cell.y + possibilityY * possibilityDiameter + (possibilityDiameter / 2)

  self.getPossibilityList(possibilityX, possibilityY).add(new Possibility(particle, cell, false))
  self.container.add(particle)
}

const verticalTopLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let x = 0; x < self.possibilityXCount; x++) {
    for (let y = 0; y < self.possibilityYCount; y++) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const verticalTopLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let x = self.possibilityYCount - 1; 0 <= x; x--) {
    for (let y = 0; y < self.possibilityYCount; y++) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const verticalBottomLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let x = 0; x < self.possibilityXCount; x++) {
    for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const verticalBottomLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let x = self.possibilityYCount - 1; 0 <= x; x--) {
    for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const horizontalTopLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let y = 0; y < self.possibilityYCount; y++) {
    for (let x = 0; x < self.possibilityXCount; x++) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const horizontalTopLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
    for (let x = 0; x < self.possibilityXCount; x++) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const horizontalBottomLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
    for (let x = 0; x < self.possibilityXCount; x++) {
      update(self.getPossibilityList(x, y))
    }
  }
}

const horizontalBottomLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
    for (let x = self.possibilityYCount - 1; 0 <= x; x--) {
      update(self.getPossibilityList(x, y))
    }
  }
}

//const checkIfListsStillCorrect = (self: Grid) => {

//for (let x = 0; x < self.possibilityXCount; x++) {
//for (let y = 0; y < self.possibilityYCount; y++) {
//const list = self.getPossibilityList(x, y)
//let current = list.head

//while (current) {
//if (current.particle) {
//const checkSpot = self.getSpot(current.particle.x, current.particle.y)
//if (list !== checkSpot.list) {
//console.error("list and spot not equal", list, checkSpot, current.particle)
//debugger
//}
//}
//current = current.next
//}
//}
//}
//}

