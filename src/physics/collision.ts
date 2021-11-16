import {Grid, Spot} from "src/grid"
import {PossibilityList} from "src/list"
import {Particle} from "src/particle"
import {Possibility} from "src/possibility"

// TODO check also cell if new spot is still in same sell,
// It can land on the same probability but still be a different cell.
export const handleCollision = (grid: Grid, currentSpot: Spot, particle: Particle): void => {
  const newX = particle.x + particle.vx
  const newY = particle.y + particle.vy

  let neighbours = grid.getNeighbourhood(newX, newY, particle.diameter)

  if (neighbours?.every(neighbour => !doesCollide(currentSpot, neighbour))) {
    return moveToProbability(currentSpot.list, neighbours[0], particle)
  }

  // Collision occured. check if other movements still possible

  neighbours = grid.getNeighbourhood(newX, particle.y, particle.diameter)

  if (neighbours?.every(neighbour => !doesCollide(currentSpot, neighbour))) {
    particle.vy = 0
    return moveToProbability(currentSpot.list, neighbours[0], particle)
  } else {
    particle.vx = 0
  }


  neighbours = grid.getNeighbourhood(particle.x, newY, particle.diameter)

  if (neighbours?.every(neighbour => !doesCollide(currentSpot, neighbour))) {
    particle.vx = 0
    return moveToProbability(currentSpot.list, neighbours[0], particle)
  } else {
    particle.vy = 0
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

const moveToProbability = (currentList: PossibilityList, newSpot: Spot, particle: Particle) => {
  currentList.remove(particle)
  newSpot.list.add(new Possibility(particle, newSpot.cell, true))
}

const equalSpot = (a: Spot, b: Spot) => {
  return a.cell === b.cell && a.list === b.list
}
