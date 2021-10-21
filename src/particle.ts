import {Position} from "./position"
import {GraphicalEntity, GraphicalEntityFactory} from "./graphicalEntity"

export interface ParticleAttributes {
  diameter: number
  spacing: number
  color: {
    red: number,
    green: number,
    blue: number
  }
  weight: number
}

export interface ParticleData {
  attributes: ParticleAttributes
  coordinates: Position
  factory: GraphicalEntityFactory
}

export class Particle {
  attributes: ParticleAttributes
  position: Position
  graphicalEntity: GraphicalEntity
  next?: Particle

  constructor(data: ParticleData) {
    const {coordinates, attributes, factory} = data
    this.position = coordinates
    this.attributes = attributes
    this.graphicalEntity = factory.create(this)
  }
}
