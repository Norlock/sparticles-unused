import {Position} from "./position"
import {GraphicalEntity, GraphicalEntityFactory} from "./graphicalEntity"
import {ApplyForces, Force} from "./physics/force"
import {Grid} from "./grid"

export interface ParticleAttributes {
  diameter: number
  color: {
    red: number,
    green: number,
    blue: number
  }
  weight: number
  type: ParticleType
  decay?: number
}

export interface ParticleData {
  attributes: ParticleAttributes
  position: Position
  factory: GraphicalEntityFactory
  applyForces: ApplyForces
}

// In the future types can be determined by temperature.
export enum ParticleType {
  LIQUID,
  GASS,
  SOLID
}

export class Particle implements Position {
  x: number
  y: number
  z?: number
  vx: number
  vy: number
  vz?: number
  diameter: number
  color: {
    red: number,
    green: number,
    blue: number
  }
  weight: number
  decay: number
  type: ParticleType
  vxEnergy: number  // potential will be used to calculate collision resolution.
  vyEnergy: number

  graphicalEntity: GraphicalEntity
  forces: Force[] = []
  frame = 0
  readonly lastFrame: number

  updateEnergy: (collider: Particle) => void

  constructor(data: ParticleData) {
    const {position, attributes, factory, applyForces} = data
    this.x = position.x
    this.y = position.y
    this.z = position.z
    this.vx = position.vx
    this.vy = position.vy
    this.vz = position.vz
    this.diameter = attributes.diameter
    this.color = attributes.color
    this.weight = attributes.weight
    this.vxEnergy = 0
    this.decay = attributes.decay ?? 0
    this.type = attributes.type

    this.graphicalEntity = factory.create(this)

    if (applyForces)
      this.forces = applyForces(this)

    this.lastFrame = this.forces.reduce(
      (last, current) => Math.max(last, current.lastFrame), 0
    )

    switch (this.type) {
      case ParticleType.SOLID:
        break
      case ParticleType.LIQUID:
        this.updateEnergy = (collider) => updateEnergyLiquid(this, collider)
        break
    }
  }
}

const updateEnergyLiquid = (self: Particle, collider: Particle) => {
  if (0 < collider.vx) {
    self.vxEnergy = Math.max(self.vxEnergy, collider.vx)
  } else if (collider.vx < 0) {
    self.vxEnergy = Math.min(self.vxEnergy, collider.vx)
  }

  if (0 < collider.vy) {
    self.vyEnergy = Math.max(self.vyEnergy, collider.vy)
  } else if (collider.vy < 0) {
    self.vyEnergy = Math.min(self.vyEnergy, collider.vy)
  }
}

