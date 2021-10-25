import {Cell} from "./cell"
import {fillParticles} from "./fillParticles"
import {GraphicalEntityFactory} from "./graphicalEntity"
import {ProbabilityList} from "./list"
import {Particle, ParticleAttributes} from "./particle"
import {ParticleContainer} from "./particleContainer"
import {ParticleContainerFactory} from "./particleContainerFactory"
import {handleCollision} from "./physics/collision"
import {applyGravity} from "./physics/gravity"
import {applyTransform} from "./physics/transform"
import {applyForce} from "./physics/force"
import {Point} from "./position"
import {Probability} from "./probability"
import {Editor, editor} from "./editor/ui"

export interface Force {
  vx?: number
  vy?: number
  frameIteration: number
}

export interface GridOptions {
  probabilityXCount: number
  probabilityYCount: number
  probabilityDiameter: number
  cellXCount: number
  cellYCount: number
  position: Point
  force?: Force
  showUI?: boolean
}

export class Grid {
  options: GridOptions
  probabilitySpots: ProbabilityList[][]
  cells: Cell[][]
  cellWidth: number
  cellHeight: number
  container: ParticleContainer
  isRendering = false
  particleCount = 0
  editor: Editor

  constructor(options: GridOptions, factory: ParticleContainerFactory) {
    const {probabilityXCount, probabilityYCount, probabilityDiameter, position} = options

    this.options = options
    this.cellWidth = probabilityXCount * probabilityDiameter
    this.cellHeight = probabilityYCount * probabilityDiameter

    this.probabilitySpots = createProbabilityGrid(probabilityXCount, probabilityYCount)
    this.cells = createCellGrid(this)
    this.container = factory.create(position)

    this.container.drawDevGrid(options)

    if (this.options.showUI === true) {
      this.editor = editor(this)
    }
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

  getSpot(x: number, y: number) {
    const {cellWidth, cellHeight, options} = this
    const {probabilityDiameter} = options

    const xResidual = x % cellWidth
    const yResidual = y % cellHeight

    const probabilityX = Math.floor(xResidual / probabilityDiameter)
    const probabilityY = Math.floor(yResidual / probabilityDiameter)

    return this.probabilitySpots[probabilityX][probabilityY]
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
  const {probabilityXCount, probabilityYCount, force} = options
  self.isRendering = true

  let i = 0
  const render = () => {
    if (self.isRendering) {
      requestAnimationFrame(render)
      i++

      for (let x = 0; x < probabilityXCount; x++) {
        for (let y = 0; y < probabilityYCount; y++) {
          let currentSpot = probabilitySpots[x][y]
          let current = currentSpot.head

          while (current) {
            let {particle} = current
            applyGravity(particle)

            if (force && i % force.frameIteration === 0) {
              applyForce(particle, force)
            }

            handleCollision(self, currentSpot, particle)
            applyTransform(particle)

            current = current.next
          }
        }
      }

      self.container.render()
    }
  }

  render()
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

  const cell = self.getCell(particle.position.x, particle.position.y)
  const xResidual = particle.position.x % cellWidth
  const yResidual = particle.position.y % cellHeight

  const probabilityX = Math.floor(xResidual / probabilityDiameter)
  const probabilityY = Math.floor(yResidual / probabilityDiameter)

  // TODO dev var just for lining out particles
  particle.position.x = cell.x + probabilityX * probabilityDiameter + (probabilityDiameter / 2)
  particle.position.y = cell.y + probabilityY * probabilityDiameter + (probabilityDiameter / 2)

  self.probabilitySpots[probabilityX][probabilityY].add(new Probability(particle, cell))
  self.container.add(particle)
}
