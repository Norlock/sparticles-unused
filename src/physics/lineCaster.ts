import {Particle} from "src/particle"
import {ExternalForce} from "./externalForces"

// lineCaster

// Create kd kind of tree but for line formula's
// two lines are added for each particle (boundries of the particle). If the force is vx 1, (se from left to right). 
// Two lines from y0, and y + diameter will be added to the tree.
// remove redundant formula's 
// if point b is placed behind point a, don't add particle for point b
// when transform will be applied it can take the tree and determine if the external force needs to be applied
//
// Advantage is that this can be calculated inside the loop for internal force application
//
// The apply transform however needs to be in a 2nd loop because it is not allowed to apply until the complete tree is
// created
//
//
// TODO learn math line formula's
// TODO make architecture for the tree
//

export enum Direction {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
  TOP_LEFT,
  BOTTOM_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT
}

export class LineTree {
  force: ExternalForce // standard line equation to add on all particles
  perpendicular: ExternalForce // needed to find if particle falls in between lines
  root: LineNode
  direction: Direction
  width: number
  height: number

  order: (a: LineNode, b: LineNode) => Order
  add: (particle: Particle) => void

  constructor(force: ExternalForce, width: number, height: number) {
    this.force = force
    this.width = width
    this.height = height
    this.perpendicular = getPerpendicularOfLine(force)

    if (0 < force.vx) {
      if (0 < force.vy) {
        this.direction = Direction.TOP_LEFT
      } else if (force.vy < 0) {
        this.direction = Direction.BOTTOM_LEFT
      } else {
        this.direction = Direction.LEFT
      }
    } else if (force.vx < 0) {
      if (0 < force.vy) {
        this.direction = Direction.TOP_RIGHT
      } else if (force.vy < 0) {
        this.direction = Direction.BOTTOM_RIGHT
      } else {
        this.direction = Direction.RIGHT
      }
    } else {
      if (0 < force.vy) {
        this.direction = Direction.TOP
      } else {
        this.direction = Direction.BOTTOM
      }
    }

    setOrderFunction(this)
    setAddFunction(this)
  }

  print() {
    //this.root.printTree()
  }
}

const setAddFunction = (self: LineTree) => {
  self.add = (rootParticle: Particle) => {
    self.root = new LineNode(rootParticle)
    self.add = (particle: Particle) => insertNodeRoot(self, new LineNode(particle))
  }
}

class LineNode {
  particle: Particle
  aboveOrLeft: LineNode
  belowOrRight: LineNode

  constructor(particle: Particle) {
    this.particle = particle
  }

  // Direction top, left, bottom, right don't need to look for intersects on the line 
  // top and bottom place the most (top/botttom) centered x particle as root 
  // left and right place the most (left/right) centered y particle as root
  //
  // TODO step 1 fill complete tree by the correct order
  // step 2 don't add redundant nodes.
}

interface Order {
  first: LineNode
  second: LineNode
}

function setOrderFunction(tree: LineTree) {
  const {direction} = tree

  if (direction === Direction.LEFT) {
    tree.order = (a: LineNode, b: LineNode) => {
      if (a.particle.x <= b.particle.x) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.RIGHT) {
    tree.order = (a: LineNode, b: LineNode) => {
      if (a.particle.x >= b.particle.x) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.TOP) {
    tree.order = (a: LineNode, b: LineNode) => {
      if (a.particle.y <= b.particle.y) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.BOTTOM) {
    tree.order = (a: LineNode, b: LineNode) => {
      if (a.particle.y >= b.particle.y) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.TOP_LEFT) {
    tree.order = (a: LineNode, b: LineNode) => {
      const aCSide = Math.sqrt(Math.pow(a.particle.x, 2) + Math.pow(a.particle.y, 2))
      const bCSide = Math.sqrt(Math.pow(b.particle.x, 2) + Math.pow(b.particle.y, 2))
      if (aCSide <= bCSide) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.TOP_RIGHT) {
    tree.order = (a: LineNode, b: LineNode) => {
      const aCSide = Math.sqrt(Math.pow(tree.width - a.particle.x, 2) + Math.pow(a.particle.y, 2))
      const bCSide = Math.sqrt(Math.pow(tree.width - b.particle.x, 2) + Math.pow(b.particle.y, 2))
      if (aCSide <= bCSide) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.BOTTOM_LEFT) {
    tree.order = (a: LineNode, b: LineNode) => {
      const aCSide = Math.sqrt(Math.pow(a.particle.x, 2) + Math.pow(tree.height - a.particle.y, 2))
      const bCSide = Math.sqrt(Math.pow(b.particle.x, 2) + Math.pow(tree.height - b.particle.y, 2))
      if (aCSide <= bCSide) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  } else if (direction === Direction.BOTTOM_RIGHT) {
    tree.order = (a: LineNode, b: LineNode) => {
      const aCSide = Math.sqrt(Math.pow(tree.width - a.particle.x, 2) + Math.pow(tree.height - a.particle.y, 2))
      const bCSide = Math.sqrt(Math.pow(tree.width - b.particle.x, 2) + Math.pow(tree.height - b.particle.y, 2))
      if (aCSide <= bCSide) {
        return {first: a, second: b}
      } else {
        return {first: b, second: a}
      }
    }
  }

  // TODO set the correct order function to the class
}

function insertNode(tree: LineTree, current: LineNode, newNode: LineNode) {
  //if (tree.direction === Direction.LEFT) {
  //console.log("left", tree.order(current, newNode))
  //} else {
  //console.log("right", tree.order(current, newNode))
  //}
}

// return (new) root 
function insertNodeRoot(tree: LineTree, newNode: LineNode) {
  const order = tree.order(tree.root, newNode)

  if (order.first !== tree.root) {
    tree.root = order.first
    console.log("new Root", tree.root, tree.direction)
  } else {
    insertNode(tree, order.second, newNode)
  }
}

function handleLeftDirection(self: LineNode, newNode: LineNode) {
  const isInner = newNode.particle.y <= self.particle.y

  if (newNode.particle.x < self.particle.x) {
    // insert new node 
    if (newNode.particle.y < self.particle.y) {
      newNode.belowOrRight = self
      if (newNode.particle.y < self.aboveOrLeft?.particle.y) {
        newNode.aboveOrLeft = self.aboveOrLeft
        self.aboveOrLeft = undefined
      }
    } else {
      newNode.aboveOrLeft = self
      if (self.belowOrRight?.particle.y < newNode.particle.y) {
        newNode.belowOrRight = self.belowOrRight
        self.belowOrRight = undefined
      }
    }

    return newNode
  }

  if (newNode.particle.y < self.particle.y) {
    if (self.aboveOrLeft) {
      self.aboveOrLeft = handleLeftDirection(self.aboveOrLeft, newNode)
    } else {
      self.aboveOrLeft = newNode
    }
  } else {
    if (self.belowOrRight) {
      self.belowOrRight = handleLeftDirection(self.belowOrRight, newNode)
    } else {
      self.belowOrRight = newNode
      // balance?
    }
  }
  return self
}

function handleTopDirection(parent: LineNode | LineTree, particle: Particle) {

  if (particle.y < this.particle.y) {
    if (parent instanceof LineTree) {
      const newRoot = new LineNode(particle)
    }
    //parent.particle
  }
}


function doesIntersect(node: LineNode, particle: Particle) {
  // TODO if particle inside lines return true
}

function lineIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
  let ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1,
    ua,
    ub
  };
}

function getPerpendicularOfLine(force: ExternalForce) { // the two points can not be the same
  const x1 = 0
  const y1 = 0
  const x2 = force.vx
  const y2 = force.vy

  var nx = x2 - x1;  // as vector
  var ny = y2 - y1;
  const len = Math.sqrt(nx * nx + ny * ny);  // length of line
  nx /= len;  // make one unit long
  ny /= len;  // which we call normalising a vector

  const perpendicular = new ExternalForce()
  perpendicular.vx = nx
  perpendicular.vy = -ny

  return perpendicular
}
