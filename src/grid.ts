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
import {LineTree} from "./physics/lineCaster"

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
  options: GridOptions
  probabilitySpots: ProbabilityList[][]
  cells: Cell[][]
  cellWidth: number
  cellHeight: number
  gridWidth: number
  gridHeight: number
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

    this.options = options
    this.cellWidth = probabilityXCount * probabilityDiameter
    this.cellHeight = probabilityYCount * probabilityDiameter
    this.gridWidth = cellXCount * this.cellWidth
    this.gridHeight = cellYCount * this.cellHeight
    this.forces = forces ?? []

    this.lastFrame = this.forces.reduce(
      (last, current) => Math.max(last, current.lastFrame), 0
    )

    this.probabilitySpots = createProbabilityGrid(probabilityXCount, probabilityYCount)
    this.cells = createCellGrid(this)
    this.container = factory.create(position)

    if (this.options.showUI === true) {
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

    const {cellWidth, cellHeight, options} = this
    const {probabilityDiameter} = options

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
  const {probabilitySpots, options} = self
  const {probabilityXCount, probabilityYCount} = options
  let update: (particle: Particle) => void
  self.isRendering = true

  const render = () => {
    //console.time()
    if (self.isRendering) {
      requestAnimationFrame(render)
      const lineTree = createTree(self)

      if (lineTree) {
        update = (particle: Particle) => {
          lineTree.add(particle)
        }
      } else {
        update = applyTransform
      }

      // TODO use appropiate loop for frame. If external force applied from right then loop from the right.
      for (let x = 0; x < probabilityXCount; x++) {
        for (let y = 0; y < probabilityYCount; y++) {
          let list = probabilitySpots[x][y]
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
            update(particle)

            current = current.next
          }
        }
      }

      // if tree exist applyTransform on tree
      self.container.render()
    }
    //console.timeEnd()
  }

  render()
}

const createTree = (self: Grid) => {
  const {forces} = self

  let tree: LineTree

  for (let force of forces) {
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
  const {cellWidth, cellHeight, options} = self
  const {cellXCount, cellYCount} = options

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
  const {cellWidth, cellHeight, options} = self
  const {probabilityDiameter} = options
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
