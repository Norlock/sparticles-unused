import {Grid, Probability} from "src/grid"
import {ProbabilityLinkedList} from "src/list"
import {Particle} from "src/particle"

export const handleCollision = (grid: Grid, currentList: ProbabilityLinkedList, particle: Particle): void => {
  const {position} = particle

  const newX = position.x + position.vx
  const newY = position.y + position.vy

  const newCell = grid.getCell(newX, newY)
  if (newCell) {
    const newList = grid.getProbabilities(newX, newY)

    let hasCollision = false
    let current = newList.head

    // New probability
    if (currentList !== newList) {
      while (current) {
        if (newCell === current.cell) {
          hasCollision = true
          break
        }
        current = current.next
      }

      if (hasCollision) {
        updatePhysics(particle)
      } else {
        currentList.remove(particle)
        newList.add(new Probability(particle, newCell))
      }
    }
  } else {
    updatePhysics(particle)
  }

}

const updatePhysics = (particle: Particle) => {
  particle.position.vx = 0
  particle.position.vy = 0
}
