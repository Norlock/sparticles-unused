import {Particle} from "./particle";
import {Possibility} from "./possibility";

export class PossibilityList {
  head: Possibility;

  add(probability: Possibility): void {
    probability.next = this.head
    this.head = probability
  }

  remove(particle: Particle): void {
    if (this.head.particle === particle) {
      this.head = this.head.next
      return
    }

    const removeRecursively = (current: Possibility) => {
      if (current.next.particle === particle) {
        current.next = current.next?.next
      } else if (current.next) {
        removeRecursively(current.next)
      }
    }

    removeRecursively(this.head)
  }
}
