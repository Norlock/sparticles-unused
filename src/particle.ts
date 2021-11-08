import {Position} from "./position"
import {GraphicalEntity, GraphicalEntityFactory} from "./graphicalEntity"
import {ApplyForces, Force} from "./physics/force"

export interface ParticleAttributes {
  diameter: number
  color: {
    red: number,
    green: number,
    blue: number
  }
  weight: number,
  potential?: number,  // potential will be used to calculate collision resolution.
}

export interface ParticleData {
  attributes: ParticleAttributes
  position: Position
  factory: GraphicalEntityFactory
  applyForces: ApplyForces
}

export class Particle implements Position {
  attributes: ParticleAttributes
  x: number
  y: number
  z?: number
  vx: number
  vy: number
  vz?: number
  graphicalEntity: GraphicalEntity
  forces: Force[] = []
  frame = 0
  readonly lastFrame: number

  constructor(data: ParticleData) {
    const {position, attributes, factory, applyForces} = data
    this.x = position.x
    this.y = position.y
    this.z = position.z
    this.vx = position.vx
    this.vy = position.vy
    this.vz = position.vz

    this.attributes = attributes
    this.graphicalEntity = factory.create(this)

    this.forces = applyForces(this)

    this.lastFrame = this.forces.reduce(
      (last, current) => Math.max(last, current.lastFrame), 0
    )
  }
}

