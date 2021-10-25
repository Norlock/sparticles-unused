import {Cell} from "src/cell"
import {Grid} from "src/grid"
import {ProbabilityLinkedList} from "src/list"
import {Particle} from "src/particle"
import {Probability} from "src/probability"

export const handleCollision = (grid: Grid, currentSpot: ProbabilityLinkedList, particle: Particle): void => {
  const {position} = particle

  const newX = position.x + position.vx
  const newY = position.y + position.vy

  const newXYSpot = grid.getSpot(newX, newY)
  if (currentSpot !== newXYSpot) {
    const newCell = grid.getCell(newX, newY)

    if (!doesCollide(newXYSpot, newCell)) {
      handleNoCollision(currentSpot, newXYSpot, particle, newCell)
      return
    }

    const newXSpot = grid.getSpot(newX, position.y)
    if (currentSpot !== newXSpot) {
      const newCell = grid.getCell(newX, position.y)

      if (doesCollide(newXSpot, newCell)) {
        particle.position.vx = 0
      } else {
        particle.position.vy = 0
        handleNoCollision(currentSpot, newXSpot, particle, newCell)
        return
      }
    }

    const newYSpot = grid.getSpot(position.x, newY)
    if (currentSpot !== newYSpot) {
      const newCell = grid.getCell(position.x, newY)

      if (doesCollide(newYSpot, newCell)) {
        particle.position.vy = 0
      } else {
        particle.position.vx = 0
        handleNoCollision(currentSpot, newYSpot, particle, newCell)
        return
      }
    }
  }
}

const doesCollide = (list: ProbabilityLinkedList, cell?: Cell) => {
  if (!cell) {
    return true
  }

  let current = list.head

  while (current) {
    if (cell === current.cell) {
      return true
    }
    current = current.next
  }
  return false
}

const handleNoCollision = (currentList: ProbabilityLinkedList, newList: ProbabilityLinkedList, particle: Particle, newCell: Cell) => {
  currentList.remove(particle)
  newList.add(new Probability(particle, newCell))
}
