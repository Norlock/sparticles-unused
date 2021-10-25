import {Particle} from "./particle";
import {Probability} from "./probability";

export class ProbabilityList {
  head: Probability;

  add(probability: Probability): void {
    probability.next = this.head
    this.head = probability
  }

  remove(particle: Particle): void {
    if (this.head.particle === particle) {
      this.head = this.head.next
      return
    }

    const removeRecursively = (current: Probability) => {
      if (current.next.particle === particle) {
        current.next = current.next?.next
      } else if (current.next) {
        removeRecursively(current.next)
      }
    }

    removeRecursively(this.head)
  }
}
