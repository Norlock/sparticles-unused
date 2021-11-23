import {Grid, Spot} from "src/grid"
import {Particle} from "src/particle"
import {Possibility} from "src/possibility"

// TODO check also cell if new spot is still in same sell,
// It can land on the same probability but still be a different cell.
export const handleCollision = (grid: Grid, currentSpot: Spot): void => {
  const {particle} = currentSpot.possibility
  const newX = particle.x + particle.vx
  const newY = particle.y + particle.vy

  let neighbours = grid.getNeighbourhood(newX, newY, particle.diameter)

  if (neighbours?.every(neighbour => !doesCollide(currentSpot, neighbour))) {
    return moveToProbability(grid, currentSpot, neighbours[0])
  }

  // Collision occured. check if other movements still possible
  neighbours = grid.getNeighbourhood(newX, particle.y, particle.diameter)

  if (neighbours?.every(neighbour => !doesCollide(currentSpot, neighbour))) {
    particle.vy = 0
    return moveToProbability(grid, currentSpot, neighbours[0])
  } else {
    particle.vx = 0
  }

  neighbours = grid.getNeighbourhood(particle.x, newY, particle.diameter)

  if (neighbours?.every(neighbour => !doesCollide(currentSpot, neighbour))) {
    particle.vx = 0
    return moveToProbability(grid, currentSpot, neighbours[0])
  } else {
    particle.vy = 0
  }
}

const doesCollide = (currentSpot: Spot, newSpot: Spot) => {
  return !newSpot || (newSpot.possibility && currentSpot.possibility !== newSpot.possibility)
}

const moveToProbability = (grid: Grid, currentSpot: Spot, newSpot: Spot) => {
  currentSpot.list.remove(currentSpot.possibility)
  newSpot.list.add(new Possibility(grid, currentSpot.possibility.particle, true))
}
