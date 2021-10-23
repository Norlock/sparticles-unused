import {Cell} from "./cell"
import {CellSelector, cellSelector} from "./cellSelector"
import {fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {Particle, ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"
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
}

export class Grid {
  options: GridOptions
  probabilities: Probability[][][]
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

  start() {
    this.isRendering = true
    start(this)
  }

  stop() {
    this.isRendering = false
  }
}

const start = (self: Grid) => {
  const {probabilities} = self

  const render = () => {
    if (self.isRendering) {
      requestAnimationFrame(render)

      for (let x = 0; x < probabilities.length; x++) {
        for (let y = 0; y < probabilities.length; y++) {
          for (let probability of probabilities[x][y]) {
            applyTransform(self, probability.particle)
          }
        }
      }
      self.container.render()
    }
  }

  render()
}

const createProbabilityGrid = (probabilityXCount: number, probabilityYCount: number) => {
  const grid: Probability[][][] = []

  // Create probabilities
  for (let x = 0; x < probabilityXCount; x++) {
    let column: Probability[][] = []
    grid.push(column)

    for (let y = 0; y < probabilityYCount; y++) {
      column.push([])
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

  const cell = self.getCell(particle.position.x, particle.position.y)

  const x = particle.position.x % cellWidth
  const y = particle.position.y % cellHeight

  const probabilityX = Math.floor(x / probabilityDiameter)
  const probabilityY = Math.floor(y / probabilityDiameter)

  self.probabilities[probabilityX][probabilityY].push({
    particle,
    cell
  })

  self.container.add(particle)
}
