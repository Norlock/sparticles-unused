import {Cell} from "./cell"
import {fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {ProbabilityLinkedList} from "./list"
import {Particle, ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"
import {handleCollision} from "./physics/collision"
import {applyGravity} from "./physics/gravity"
import {applyTransform} from "./physics/transform"
import {Point} from "./position"

export interface GridOptions {
  probabilityXCount: number
  probabilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number
  position: Point
}

export class Probability {
  particle: Particle
  cell: Cell
  next?: Probability

  constructor(particle: Particle, cell: Cell) {
    this.particle = particle
    this.cell = cell
  }
}

export class Grid {
  options: GridOptions
  probabilities: ProbabilityLinkedList[][]
  cells: Cell[][]
  cellWidth: number
  cellHeight: number
  container: ParticleContainer
  isRendering = false

  constructor(options: GridOptions, factory: ParticleContainerFactory) {
    const {probabilityXCount, probabilityYCount, probabilityDiameter, position} = options

    this.options = options
    this.cellWidth = probabilityXCount * probabilityDiameter
    this.cellHeight = probabilityYCount * probabilityDiameter

    this.probabilities = createProbabilityGrid(probabilityXCount, probabilityYCount)
    this.cells = createCellGrid(this)
    this.container = factory.create(position)

    console.log('grid', this.probabilities)
    console.log('cells', this.cells)
  }

  addParticle(particle: Particle) {
    addParticle(this, particle)
  }

  fill(attributes: ParticleAttributes, factory: GraphicalEntityFactory) {
    return fillParticles(this, attributes, factory)
  }

  getCell(x: number, y: number) {
    const {cellXCount, cellYCount} = this.options
    const xIndex = Math.floor(x / this.cellWidth)
    const yIndex = Math.floor(y / this.cellHeight)

    if (0 <= xIndex && xIndex < cellXCount
      && 0 <= yIndex && yIndex < cellYCount) {
      return this.cells[xIndex][yIndex]
    }
  }

  getProbabilities(x: number, y: number) {
    return getProbabilities(this, x, y)
  }

  start() {
    start(this)
  }

  stop() {
    this.isRendering = false
  }
}

const start = (self: Grid) => {
  const {probabilities, options} = self
  const {probabilityXCount, probabilityYCount} = options
  self.isRendering = true

  const render = () => {
    if (self.isRendering) {
      console.time()
      requestAnimationFrame(render)

      for (let x = 0; x < probabilityXCount; x++) {
        for (let y = 0; y < probabilityYCount; y++) {
          let currentList = probabilities[x][y]
          let current = currentList.head

          while (current) {
            let {particle} = current
            applyGravity(particle)
            handleCollision(self, currentList, particle)
            applyTransform(particle)

            current = current.next
          }
        }
      }

      self.container.render()
      console.timeEnd()
    }
  }

  render()
}

const createProbabilityGrid = (probabilityXCount: number, probabilityYCount: number) => {
  const grid: ProbabilityLinkedList[][] = []

  // Create probabilities
  for (let x = 0; x < probabilityXCount; x++) {
    let column: ProbabilityLinkedList[] = []
    grid.push(column)

    for (let y = 0; y < probabilityYCount; y++) {
      column.push(new ProbabilityLinkedList())
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

const getProbabilities = (self: Grid, x: number, y: number) => {
  const {cellWidth, cellHeight, options} = self
  const {probabilityDiameter} = options

  const xResidual = x % cellWidth
  const yResidual = y % cellHeight

  const probabilityX = Math.floor(xResidual / probabilityDiameter)
  const probabilityY = Math.floor(yResidual / probabilityDiameter)

  return self.probabilities[probabilityX][probabilityY]
}

const addParticle = (self: Grid, particle: Particle) => {
  const {cellWidth, cellHeight, options} = self
  const {probabilityDiameter} = options

  const cell = self.getCell(particle.position.x, particle.position.y)
  const xResidual = particle.position.x % cellWidth
  const yResidual = particle.position.y % cellHeight

  const probabilityX = Math.floor(xResidual / probabilityDiameter)
  const probabilityY = Math.floor(yResidual / probabilityDiameter)

  // TODO dev var just for lining out particles
  particle.position.x = cell.x + probabilityX * probabilityDiameter + (probabilityDiameter / 2)
  particle.position.y = cell.y + probabilityY * probabilityDiameter + (probabilityDiameter / 2)


  self.probabilities[probabilityX][probabilityY].add(new Probability(particle, cell))
  self.container.add(particle)
}
