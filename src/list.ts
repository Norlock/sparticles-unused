import {Possibility} from "./possibility";

export class PossibilityList {
  head: Possibility;

  add(possibility: Possibility): void {
    possibility.next = this.head
    this.head = possibility
  }

  remove(toRemove: Possibility): void {
    if (this.head === toRemove) {
      this.head = this.head.next
      return
    }

    const removeRecursively = (current: Possibility) => {
      if (current.next === toRemove) {
        current.next = current.next.next
      } else if (current.next) {
        removeRecursively(current.next)
      }
    }

    removeRecursively(this.head)
  }
}
