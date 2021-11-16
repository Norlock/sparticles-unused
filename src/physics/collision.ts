import {Grid, Spot} from "src/grid"
import {PossibilityList} from "src/list"
import {Particle} from "src/particle"
import {Possibility} from "src/possibility"

// TODO check also cell if new spot is still in same sell,
// It can land on the same probability but still be a different cell.
export const handleCollision = (grid: Grid, currentSpot: Spot, particle: Particle): void => {
  const newX = particle.x + particle.vx
  const newY = particle.y + particle.vy

  const newXYSpot = grid.getSpot(newX, newY)
  const newXYASpot = grid.getSpot(newX + particle.diameter, newY)
  const newXYBSpot = grid.getSpot(newX, newY + particle.diameter)
  const newXYCSpot = grid.getSpot(newX + particle.diameter, newY + particle.diameter)

  if (!doesCollide(currentSpot, newXYSpot) && !doesCollide(currentSpot, newXYASpot)
    && !doesCollide(currentSpot, newXYBSpot) && !doesCollide(currentSpot, newXYCSpot)) {
    return moveToProbability(currentSpot.list, newXYSpot, particle)
  }

  // Collision occured. check if other movements still possible
  const newXSpot = grid.getSpot(newX, particle.y)
  const newXASpot = grid.getSpot(newX + particle.diameter, particle.y)
  const newXBSpot = grid.getSpot(newX, particle.y + particle.diameter)
  const newXCSpot = grid.getSpot(newX + particle.diameter, particle.y + particle.diameter)

  if (doesCollide(currentSpot, newXSpot) || doesCollide(currentSpot, newXASpot)
    || doesCollide(currentSpot, newXBSpot) || doesCollide(currentSpot, newXCSpot)) {
    particle.vx = 0
  } else {
    particle.vy = 0
    return moveToProbability(currentSpot.list, newXSpot, particle)
  }

  const newYSpot = grid.getSpot(particle.x, newY)
  const newYASpot = grid.getSpot(particle.x, newY + particle.diameter)
  const newYBSpot = grid.getSpot(particle.x + particle.diameter, newY)
  const newYCSpot = grid.getSpot(particle.x + particle.diameter, newY + particle.diameter)

  if (doesCollide(currentSpot, newYSpot) || doesCollide(currentSpot, newYASpot)
    || doesCollide(currentSpot, newYBSpot) || doesCollide(currentSpot, newYCSpot)) {
    particle.vy = 0
  } else {
    particle.vx = 0
    return moveToProbability(currentSpot.list, newYSpot, particle)
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
