import {Coordinates} from "./coordinates"
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
  coordinates: Coordinates
  factory: GraphicalEntityFactory
}

export class Particle {
  attributes: ParticleAttributes
  coordinates: Coordinates
  graphicalEntity: GraphicalEntity
  next?: Particle

  constructor(data: ParticleData) {
    const {coordinates, attributes, factory} = data
    this.coordinates = coordinates
    this.attributes = attributes
    this.graphicalEntity = factory.create(this)
  }
}
