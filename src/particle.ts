import {Position} from "./position"
import {GraphicalEntity, GraphicalEntityFactory} from "./graphicalEntity"

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
}

export class Particle {
  attributes: ParticleAttributes
  position: Position
  graphicalEntity: GraphicalEntity
  next?: Particle

  constructor(data: ParticleData) {
    const {position, attributes, factory} = data
    console.log('test', position)
    this.position = position
    this.attributes = attributes
    this.graphicalEntity = factory.create(this)
  }
}
