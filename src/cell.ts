import {Particle} from './particle'
// Cells will add particles

export interface Cell {
  x: number
  y: number
  particles: List
}

interface List {
  add(particle: Particle): void
}

export class ParticleLLCell implements Cell {
  x: number
  y: number
  particles: ParticleLinkedList

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.particles = new ParticleLinkedList()
  }
}

export class ParticleLinkedList implements List {
  head: Particle;

  add(particle: Particle): void {
    particle.previous = undefined

    const previous = this.head
    this.head = particle
    this.head.next = previous

    if (previous) {
      previous.previous = this.head
    }
  }
}
