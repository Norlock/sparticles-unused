import {Cell} from "./cell";
import {Particle} from "./particle";
import {applyGravity} from "./physics/gravity";
import {applyTransform} from "./physics/transform";

export interface List {
  add(particle: Particle): void
  remove(particle: Particle): void
  update(): void
}

export class ParticleLinkedList implements List {
  head: Particle;
  cell: Cell

  constructor(cell: Cell) {
    this.cell = cell
  }

  add(particle: Particle): void {
    particle.next = this.head
    this.head = particle
  }

  remove(particle: Particle): void {
    if (!this.head) {
      return
    }

    if (this.head === particle) {
      this.head = particle.next
    } else {
      const removeRecursively = (current: Particle) => {
        if (current.next === particle) {
          current.next = particle.next
        } else if (current.next) {
          removeRecursively(current.next)
        }
      }

      removeRecursively(this.head)
    }
  }

  update() {
    let current = this.head

    while (current) {
      applyGravity(this.cell, current)
      current = applyTransform(this.cell, current)
    }
  }
}
