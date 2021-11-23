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
import {ExternalForce} from "./physics/externalForces"

type UpdateSpot = (list: PossibilityList) => void

export interface GridOptions {
  possibilityXCount: number
  possibilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number
  position: Point
  showUI: boolean
}

export interface Spot {
  possibility?: Possibility,
  list: PossibilityList
}

export class Grid {
  possibilitySpots: PossibilityList[]
  cellWidth: number
  cellHeight: number
  gridWidth: number
  gridHeight: number
  possibilityXCount: number
  possibilityYCount: number
  possibilityDiameter: number
  cellXCount: number
  cellYCount: number
  showUI: boolean

  container: ParticleContainer
  isRendering = false
  particleCount = 0
  editor: Editor
  forces: ExternalForce[] = []
  lastFrame: number
  frame = 0

  constructor(options: GridOptions, factory: ParticleContainerFactory) {
    const {possibilityXCount, possibilityYCount,
      cellXCount, cellYCount, probabilityDiameter, position} = options

    this.cellWidth = possibilityXCount * probabilityDiameter
    this.cellHeight = possibilityYCount * probabilityDiameter
    this.gridWidth = cellXCount * this.cellWidth
    this.gridHeight = cellYCount * this.cellHeight
    this.possibilityXCount = possibilityXCount
    this.possibilityYCount = possibilityYCount
    this.possibilityDiameter = probabilityDiameter
    this.cellXCount = cellXCount
    this.cellYCount = cellYCount

    this.possibilitySpots = createPossibilityGrid(possibilityXCount, possibilityYCount)
    this.container = factory.create(position)

    this.showUI = options.showUI
    if (this.showUI === true) {
      this.container.drawDevGrid(options)
      this.editor = editor(this)
    }
  }

  setExternalForces(forces: ExternalForce[]) {
    this.forces = forces

    this.lastFrame = this.forces.reduce(
      (last, current) => Math.max(last, current.lastFrame), 0
    )
  }

  addParticle(particle: Particle) {
    addParticle(this, particle)
  }

  fill(attributes: ParticleAttributes, factory: GraphicalEntityFactory) {
    return fillParticles(this, attributes, factory)
  }

  getCellXIndex(xCoord: number) {
    return Math.floor(xCoord / this.cellWidth)
  }

  getCellYIndex(yCoord: number) {
    return Math.floor(yCoord / this.cellHeight)
  }

  getNeighbourhood(xCoord: number, yCoord: number, diameter: number) {
    const xResidual = xCoord % this.cellWidth
    const yResidual = yCoord % this.cellHeight
    const hasNewXSpot = this.possibilityDiameter < xResidual + diameter
    const hasNewYSpot = this.possibilityDiameter < yResidual + diameter

    const currentSpot = this.getSpot(xCoord, yCoord)
    if (!currentSpot) return

    const neighbours: Spot[] = [currentSpot]

    if (hasNewXSpot) {
      const newXSpot = this.getSpot(xCoord + diameter, yCoord)
      if (newXSpot)
        neighbours.push(newXSpot)

      if (hasNewYSpot) {
        const newXYSpot = this.getSpot(xCoord + diameter, yCoord + diameter)
        if (newXYSpot)
          neighbours.push(newXYSpot)
      }
    }

    if (hasNewYSpot) {
      const newYSpot = this.getSpot(xCoord, yCoord + diameter)
      if (newYSpot)
        neighbours.push(newYSpot)
    }

    return neighbours
  }

  getPossibilityListByIndex(xIndex: number, yIndex: number): PossibilityList {
    return this.possibilitySpots[yIndex * this.possibilityXCount + xIndex]
  }

  getPossibilityList(xCoord: number, yCoord: number): PossibilityList {
    if (xCoord < 0 || this.gridWidth <= xCoord
      || yCoord < 0 || this.gridHeight <= yCoord) {
      return
    }

    const xResidual = xCoord % this.cellWidth
    const yResidual = yCoord % this.cellHeight

    const xIndex = Math.floor(xResidual / this.possibilityDiameter)
    const yIndex = Math.floor(yResidual / this.possibilityDiameter)

    return this.getPossibilityListByIndex(xIndex, yIndex)
  }

  getSpot(xCoord: number, yCoord: number): Spot {

    const list = this.getPossibilityList(xCoord, yCoord)
    if (!list) return

    const cellXIndex = this.getCellXIndex(xCoord)
    const cellYIndex = this.getCellYIndex(yCoord)

    let possbility = list.head
    while (possbility) {
      if (cellXIndex === possbility.cellXIndex && cellYIndex === possbility.cellYIndex) {
        return {
          list,
          possibility: possbility
        }
      }
      possbility = possbility.next
    }

    return {list}
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
    externalForce.apply()
  } else {
    horizontalTopLoopFromLeft(self, updateCB(self))
  }
  self.container.render()
}

export const updateCB = (self: Grid) => {
  const update = (list: PossibilityList) => {
    let possibility = list.head

    while (possibility) {
      if (possibility.inQueue === true) {
        possibility.inQueue = false
        possibility = possibility.next
        continue
      }

      const {particle} = possibility
      applyInternalForces(particle)
      handleCollision(self, {list, possibility})
      applyTransform(particle)

      possibility = possibility.next
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

const createPossibilityGrid = (probabilityXCount: number, probabilityYCount: number) => {
  const grid: PossibilityList[] = []

  // Create probabilities
  for (let y = 0; y < probabilityYCount; y++) {
    for (let x = 0; x < probabilityXCount; x++) {
      grid.push(new PossibilityList())
    }
  }

  return grid
}

const addParticle = (self: Grid, particle: Particle) => {
  const {cellWidth, cellHeight, possibilityDiameter} = self
  self.particleCount++

  const xResidual = particle.x % cellWidth
  const yResidual = particle.y % cellHeight

  const possibilityX = Math.floor(xResidual / possibilityDiameter)
  const possibilityY = Math.floor(yResidual / possibilityDiameter)

  const possibility = new Possibility(self, particle, false)
  self.getPossibilityList(possibilityX, possibilityY).add(possibility)
  self.container.add(particle)
}

const verticalTopLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let x = 0; x < self.possibilityXCount; x++) {
    for (let y = 0; y < self.possibilityYCount; y++) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const verticalTopLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let x = self.possibilityYCount - 1; 0 <= x; x--) {
    for (let y = 0; y < self.possibilityYCount; y++) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const verticalBottomLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let x = 0; x < self.possibilityXCount; x++) {
    for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const verticalBottomLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let x = self.possibilityYCount - 1; 0 <= x; x--) {
    for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const horizontalTopLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let y = 0; y < self.possibilityYCount; y++) {
    for (let x = 0; x < self.possibilityXCount; x++) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const horizontalTopLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
    for (let x = 0; x < self.possibilityXCount; x++) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const horizontalBottomLoopFromLeft = (self: Grid, update: UpdateSpot) => {
  for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
    for (let x = 0; x < self.possibilityXCount; x++) {
      update(self.getPossibilityListByIndex(x, y))
    }
  }
}

const horizontalBottomLoopFromRight = (self: Grid, update: UpdateSpot) => {
  for (let y = self.possibilityYCount - 1; 0 <= y; y--) {
    for (let x = self.possibilityYCount - 1; 0 <= x; x--) {
      update(self.getPossibilityListByIndex(x, y))
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

