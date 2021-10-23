import {Particle} from "../particle"
import {Cell} from "../cell"
import {Position} from "../position"

export const handleCollision = (cell: Cell, particle: Particle): void => {
  //const {position} = particle

  //const x = position.x + position.vx
  //const y = position.y + position.vy

  //const newCell = cell.selector.getCell(x, y)
  //if (!newCell) {
  //// Do nothing for now, TODO implement some logic in the future
  //return
  //}

  //if (newCell !== cell) {
  //// Detect collision in other cell
  //// Check if future is possible in other cell. (lets say cell below is filled on y 0)
  //} else {
  //// Check if collisions prevents future of this particle
  //// Determine starting position 

  //detectCollision(cell, self)
  //}
}

//const hasCollision = (a: Particle, b: Particle) => {
  //return hasXCollision(a, b) && hasYCollision(a, b)
//}

//const nextPoint = (particle: Particle) => {
  //return particle.position.x + particle.position.vx
//}

//const hasXCollision = (a: Particle, b: Particle) => {
  //return !(a.position.x + a.attributes.diameter < b.position.x
    //&& b.position.x + b.attributes.diameter < a.position.x)
//}

//const hasYCollision = (self: Future, compare: Future) => {
  //return !(self.next.y + self.particle.attributes.diameter < compare.next.y
    //&& compare.next.y + compare.particle.attributes.diameter < self.next.y)
//}

//const detectCollision = (cell: Cell, self: Future) => {
  //for (let compare of futures) {

    //// Collides
    //// check if x/y collides in same directions or opposite direction
    //// in same direction, closest to target will win.
    //// in opposite directions, highest velocity will win. And slowest velocity will be inverted - some loss. 
    //// In same velocity both will be placed at the same offset 
    ////
    //// If collision occures vx / vy is updated but not immediately acted upon
    //// Next iteration the particle with the updated vx, vy will try to move again to prevent endless collision detection
    //if (hasCollision(self, compare)) {
      //handleXCollision(self, compare)
      //handleYCollision(self, compare)
    //}
  //}
//}

//enum HorizontalDirection {
  //LEFT,
  //RIGHT,
  //OPPOSITE
//}

//const xCollisionDirection = (a: Position, b: Position): HorizontalDirection => {
  //if (0 <= a.vx && 0 <= b.vx) {
    //return HorizontalDirection.RIGHT
  //} else if (a.vx <= 0 && b.vx <= 0) {
    //return HorizontalDirection.LEFT
  //} else {
    //return HorizontalDirection.OPPOSITE
  //}
//}


//const handleLeftCollision = (a: Future, b: Future) => {
  //// e.g. -5 to left && -3 to left
  //if (a.next.vx < b.next.vx) {
    //// a hit b
    //a.next.x = a.particle.position.x
  //} else {
    //// b hit a 
    //b.next.x = b.particle.position.x
  //}
//}

//const handleRightCollision = (a: Future, b: Future) => {
  //// e.g. 3 to right && 5 to right
  //if (a.next.vx < b.next.vx) {
    //// b hit a
    //b.next.x = b.particle.position.x
  //} else {
    //// a hit b 
    //a.next.x = a.particle.position.x
  //}
//}

//const handleXCollision = (a: Future, b: Future) => {
  //const direction = xCollisionDirection(a.next, b.next)

  //switch (direction) {
    //case HorizontalDirection.LEFT:
      //handleLeftCollision(a, b)
      //break
    //case HorizontalDirection.RIGHT:
      //handleRightCollision(a, b)
      //break
    //case HorizontalDirection.OPPOSITE:
      //// do something
      //break
  //}
//}

//enum VerticalDirection {
  //ABOVE,
  //BELOW,
  //OPPOSITE
//}

//const yCollisionDirection = (a: Position, b: Position): VerticalDirection => {
  //if (0 <= a.vy && 0 <= b.vy) {
    //return VerticalDirection.ABOVE
  //} else if (a.vy <= 0 && b.vy <= 0) {
    //return VerticalDirection.BELOW
  //} else {
    //return VerticalDirection.OPPOSITE
  //}
//}

//const handleYCollision = (a: Future, b: Future) => {
  //const direction = yCollisionDirection(a.next, b.next)

  //switch (direction) {
    //case VerticalDirection.ABOVE:
      //handleAboveCollision(a, b)
      //break
    //case VerticalDirection.BELOW:
      //handleBelowCollision(a, b)
      //break
    //case VerticalDirection.OPPOSITE:
      //// do something
      //break
  //}
//}

//const handleAboveCollision = (a: Future, b: Future) => {
  //// e.g. 3 to above && 5 to above
  //if (a.next.vy < b.next.vy) {
    //// b hit a 
    //b.next.x = b.particle.position.x
  //} else {
    //// a hit b
    //a.next.x = a.particle.position.x
  //}
//}

//const handleBelowCollision = (a: Future, b: Future) => {
  //// e.g. -5 to below && -3 to below
  //if (a.next.vy < b.next.vy) {
    //// a hit b
    //a.next.x = a.particle.position.x
  //} else {
    //// b hit a 
    //b.next.x = b.particle.position.x
  //}
//}

//const handleJoinCell = (currentCell: Cell, newCell: Cell, future: Future) => {
  //let currentParticle = newCell.particles.head

  //if (!currentParticle) {
    //newCell.particles.add(currentParticle)
    //return
  //}
//}
