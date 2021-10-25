import {Cell} from "src/cell"
import {Grid} from "src/grid"
import {ProbabilityLinkedList} from "src/list"
import {Particle} from "src/particle"
import {Probability} from "src/probability"

export const handleCollision = (grid: Grid, currentList: ProbabilityLinkedList, particle: Particle): void => {
  const {position} = particle

  const newX = position.x + position.vx
  const newY = position.y + position.vy

  const newXYList = grid.getProbabilities(newX, newY)
  if (currentList !== newXYList) {
    const newCell = grid.getCell(newX, newY)

    if (!doesCollide(newXYList, newCell)) {
      handleNoCollision(currentList, newXYList, particle, newCell)
      return
    }

    const newXList = grid.getProbabilities(newX, position.y)
    if (currentList !== newXList) {
      const newCell = grid.getCell(newX, position.y)

      // if x movement possible don't reset it
      if (doesCollide(newXList, newCell)) {
        particle.position.vx = 0
      } else {
        particle.position.vy = 0
        handleNoCollision(currentList, newXList, particle, newCell)
        return
      }
    }

    const newYList = grid.getProbabilities(position.x, newY)
    if (currentList !== newYList) {
      const newCell = grid.getCell(position.x, newY)

      if (doesCollide(newYList, newCell)) {
        particle.position.vy = 0
      } else {
        particle.position.vx = 0
        handleNoCollision(currentList, newYList, particle, newCell)
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
