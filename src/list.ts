import {Cell} from "./cell";
import {Particle} from "./particle";

export interface List {
  add(particle: Particle): void
  iterate(callbacks: IterateCallback[]): void
}

type IterateCallback = (cell: Cell, particle: Particle) => void

export class ParticleLinkedList implements List {
  head: Particle;
  cell: Cell

  constructor(cell: Cell) {
    this.cell = cell
  }

  add(particle: Particle): void {
    particle.previous = undefined

    const previous = this.head
    this.head = particle
    this.head.next = previous

    if (previous) {
      previous.previous = this.head
    }
  }

  iterate(callbacks: IterateCallback[]) {
    let current = this.head

    while (current) {
      callbacks.forEach(callback => {
        callback(this.cell, current)
      })

      current = current.next
    }
  }
}
