import {Particle} from "../particle"
import {Cell} from "../cell"
import {Position} from "../position"

interface Future {
  particle: Particle
  next: Position
}

export const applyFutures = (futures: Future[], cell: Cell, particle: Particle): void => {
  const {position: coordinates} = particle

  const x = coordinates.x + coordinates.vx
  const y = coordinates.y + coordinates.vy

  const self: Future = {
    particle,
    next: new Position({
      x, y, vx: coordinates.vx, vy: coordinates.vy
    })
  }

  const newCell = cell.selector.getCell(x, y)

  if (newCell && newCell !== cell) {
    // Detect collision in other cell
    // Check if future is possible in other cell. (lets say cell below is filled on y 0)
  } else {
    // Check if collisions prevents future of this particle
    // Determine starting position 
    applyCollision(futures, self)
  }
}

const applyCollision = (futures: Future[], self: Future) => {
  for (let compare of futures) {
    const {next} = compare

    // Collides
    // check if x/y collides in same directions or opposite direction
    // in same direction, closest to target will win.
    // in opposite directions, highest velocity will win. And slowest velocity will be inverted - some loss. 
    // In same velocity both will be placed at the same offset 
    //
    // If collision occures vx / vy is updated but not immediately acted upon
    // Next iteration the particle with the updated vx, vy will try to move again to prevent endless collision detection
    if (next.x === self.next.x) {
      applyXCollision(self, compare)
    }

    if (next.y === self.next.y) {
      applyYCollision(self, compare)
    }
  }
}

enum HorizontalDirection {
  LEFT,
  RIGHT,
  OPPOSITE
}

const xCollisionDirection = (a: Position, b: Position): HorizontalDirection => {
  if (0 <= a.vx && 0 <= b.vx) {
    return HorizontalDirection.LEFT
  } else if (a.vx <= 0 && b.vx <= 0) {
    return HorizontalDirection.RIGHT
  } else {
    return HorizontalDirection.OPPOSITE
  }
}

const applyXCollision = (self: Future, compare: Future) => {
  const direction = xCollisionDirection(self.next, compare.next)

  switch (direction) {
    case HorizontalDirection.LEFT:
      // do something
      break
    case HorizontalDirection.RIGHT:
      // do something
      break
    case HorizontalDirection.OPPOSITE:
      // do something
      break
  }
}

enum VerticalDirection {
  ABOVE,
  BELOW,
  OPPOSITE
}

const yCollisionDirection = (a: Position, b: Position): VerticalDirection => {
  if (0 <= a.vy && 0 <= b.vy) {
    return VerticalDirection.ABOVE
  } else if (a.vy <= 0 && b.vy <= 0) {
    return VerticalDirection.BELOW
  } else {
    return VerticalDirection.OPPOSITE
  }
}

const applyYCollision = (self: Future, compare: Future) => {
  const direction = yCollisionDirection(self.next, compare.next)

  switch (direction) {
    case VerticalDirection.ABOVE:
      // do something
      break
    case VerticalDirection.BELOW:
      // do something
      break
    case VerticalDirection.OPPOSITE:
      // do something
      break
  }
}

const applyAboveCollision = (self: Future, compare: Future) => {
  if (self.next.vy - compare.next.vy < 0) {

  }
}
