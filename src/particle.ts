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
  weight: number
}

export interface ParticleData {
  attributes: ParticleAttributes
  position: Position
  factory: GraphicalEntityFactory
  applyForces: ApplyForces
}

export class Particle {
  attributes: ParticleAttributes
  position: Position
  graphicalEntity: GraphicalEntity
  forces: Force[] = []

  constructor(data: ParticleData) {
    const {position, attributes, factory, applyForces} = data
    this.position = position
    this.attributes = attributes
    this.graphicalEntity = factory.create(this)
    this.forces = applyForces(this)
  }
}
