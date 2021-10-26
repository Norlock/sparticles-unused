import {Grid, Spot} from "src/grid"
import {ProbabilityList} from "src/list"
import {Particle} from "src/particle"
import {Probability} from "src/probability"

// TODO check also cell if new spot is still in same sell,
// It can land on the same probability but still be a different cell.
export const handleCollision = (grid: Grid, current: Spot, particle: Particle): void => {
  const {position} = particle

  const newX = position.x + position.vx
  const newY = position.y + position.vy

  const newXYSpot = grid.getSpot(newX, newY)
  if (!doesCollide(current, newXYSpot)) {
    moveToProbability(current.list, newXYSpot, particle)
    return
  }

  // Collision occured. check if other movements still possible
  const newXSpot = grid.getSpot(newX, position.y)
  if (doesCollide(current, newXSpot)) {
    particle.position.vx = 0
  } else {
    particle.position.vy = 0
    moveToProbability(current.list, newXSpot, particle)
    return
  }

  const newYSpot = grid.getSpot(position.x, newY)
  if (doesCollide(current, newYSpot)) {
    particle.position.vy = 0
  } else {
    particle.position.vx = 0
    moveToProbability(current.list, newYSpot, particle)
    return
  }
}

const doesCollide = (currentSpot: Spot, newSpot: Spot) => {
  if (!newSpot) {
    return true
  } else if (equalSpot(currentSpot, newSpot)) {
    return false
  }

  let compare = newSpot.list.head

  while (compare) {
    if (newSpot.cell === compare.cell) {
      return true
    }
    compare = compare.next
  }
  return false
}

const moveToProbability = (currentList: ProbabilityList, newSpot: Spot, particle: Particle) => {
  currentList.remove(particle)
  newSpot.list.add(new Probability(particle, newSpot.cell))
}

const equalSpot = (a: Spot, b: Spot) => {
  return a.cell === b.cell && a.list === b.list
}
