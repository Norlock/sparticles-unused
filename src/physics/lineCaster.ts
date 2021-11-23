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

  isInOrder: (a: Particle, b: Particle) => boolean
  add: (particle: Particle) => void
  createRoot: (particle: Particle) => LineNode

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

    setTreeFunctions(this)
  }

  print() {
    //this.root.printTree()
  }
}

abstract class LineNode {
  particle: Particle

  constructor(particle: Particle) {
    this.particle = particle
  }

  abstract add(tree: LineTree, newParticle: Particle): void
  abstract setNewRoot(tree: LineTree, newParticle: Particle): void
}

class HorizontalLineNode extends LineNode {
  top: HorizontalLineNode
  bottom: HorizontalLineNode

  private addToBottom(tree: LineTree, newParticle: Particle) {
    if (this.bottom) {
      if (tree.isInOrder(newParticle, this.bottom.particle)) {
        const insertNode = new HorizontalLineNode(newParticle)
        if (newParticle.y < this.particle.y) {
          insertNode.bottom = this.bottom
        } else {
          insertNode.top = this.bottom
        }

        this.bottom = insertNode
      } else {
        this.bottom.add(tree, newParticle)
      }
    } else {
      this.bottom = new HorizontalLineNode(newParticle)
    }
  }

  private addToTop(tree: LineTree, newParticle: Particle) {
    if (this.top) {
      if (tree.isInOrder(newParticle, this.top.particle)) {
        const insertNode = new HorizontalLineNode(newParticle)
        if (this.particle.y < newParticle.y) {
          insertNode.top = this.top
        } else {
          insertNode.bottom = this.top
        }

        this.top = insertNode
      } else {
        this.top.add(tree, newParticle)
      }
    } else {
      this.top = new HorizontalLineNode(newParticle)
    }
  }

  add(tree: LineTree, newParticle: Particle): void {
    if (this.particle.y < newParticle.y) {
      this.addToBottom(tree, newParticle)
    } else {
      this.addToTop(tree, newParticle)
    }
  }

  setNewRoot(tree: LineTree, newParticle: Particle): void {
    const newRoot = new HorizontalLineNode(newParticle)
    if (this.particle.y < newParticle.y) {
      newRoot.top = this
    } else {
      newRoot.bottom = this
    }

    tree.root = newRoot
  }
}

class VerticalLineNode extends LineNode {
  left: VerticalLineNode
  right: VerticalLineNode

  connect(insertNode: VerticalLineNode, after: VerticalLineNode) {
    if (after.particle.x < insertNode.particle.x) {
      insertNode.left = after
    } else {
      insertNode.right = after
    }
  }

  private addToLeft(tree: LineTree, newParticle: Particle) {
    if (this.left) {
      if (tree.isInOrder(newParticle, this.left.particle)) {
        const insertNode = new VerticalLineNode(newParticle)
        this.connect(insertNode, this.left)
        this.left = insertNode
      } else {
        this.left.add(tree, newParticle)
      }
    } else {
      this.left = new VerticalLineNode(newParticle)
    }
  }

  private addToRight(tree: LineTree, newParticle: Particle) {
    if (this.right) {
      if (tree.isInOrder(newParticle, this.right.particle)) {
        const insertNode = new VerticalLineNode(newParticle)
        this.connect(insertNode, this.right)
        this.right = insertNode
      } else {
        this.left.add(tree, newParticle)
      }
    } else {
      this.left = new VerticalLineNode(newParticle)
    }
  }

  add(tree: LineTree, newParticle: Particle): void {
    if (this.particle.x < newParticle.x) {
      this.addToLeft(tree, newParticle)
    } else {
      this.addToRight(tree, newParticle)
    }
  }

  setNewRoot(tree: LineTree, newParticle: Particle): void {
    const newRoot = new VerticalLineNode(newParticle)
    this.connect(newRoot, this)
    tree.root = newRoot
  }
}

function setTreeFunctions(tree: LineTree) {
  const {direction} = tree

  const createRootHorizontal = (particle: Particle) => {
    return new HorizontalLineNode(particle)
  }

  const createRootVertical = (particle: Particle) => {
    return new VerticalLineNode(particle)
  }

  if (direction === Direction.LEFT) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      return a.x <= b.x
    }
    tree.createRoot = createRootHorizontal
  } else if (direction === Direction.RIGHT) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      return a.x >= b.x
    }
    tree.createRoot = createRootHorizontal
  } else if (direction === Direction.TOP) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      return a.y <= b.y
    }
    tree.createRoot = createRootVertical
  } else if (direction === Direction.BOTTOM) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      return a.y >= b.y
    }
    tree.createRoot = createRootVertical
  } else if (direction === Direction.TOP_LEFT) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      const aCSide = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2))
      const bCSide = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2))
      return aCSide <= bCSide
    }
    tree.createRoot = createRootVertical
  } else if (direction === Direction.TOP_RIGHT) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      const aCSide = Math.sqrt(Math.pow(tree.width - a.x, 2) + Math.pow(a.y, 2))
      const bCSide = Math.sqrt(Math.pow(tree.width - b.x, 2) + Math.pow(b.y, 2))
      return aCSide <= bCSide
    }
    tree.createRoot = createRootVertical
  } else if (direction === Direction.BOTTOM_LEFT) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      const aCSide = Math.sqrt(Math.pow(a.x, 2) + Math.pow(tree.height - a.y, 2))
      const bCSide = Math.sqrt(Math.pow(b.x, 2) + Math.pow(tree.height - b.y, 2))
      return aCSide <= bCSide
    }
    tree.createRoot = createRootVertical
  } else if (direction === Direction.BOTTOM_RIGHT) {
    tree.isInOrder = (a: Particle, b: Particle) => {
      const aCSide = Math.sqrt(Math.pow(tree.width - a.x, 2) + Math.pow(tree.height - a.y, 2))
      const bCSide = Math.sqrt(Math.pow(tree.width - b.x, 2) + Math.pow(tree.height - b.y, 2))
      return aCSide <= bCSide
    }
    tree.createRoot = createRootVertical
  }

  tree.add = (particle: Particle) => insertNodeRoot(tree, particle)
}

function insertNodeRoot(tree: LineTree, particle: Particle) {
  if (!tree.root) {
    tree.root = tree.createRoot(particle)
  } else if (tree.isInOrder(particle, tree.root.particle)) {
    tree.root.setNewRoot(tree, particle)
  } else {
    tree.root.add(tree, particle)
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

  //const perpendicular = new ExternalForce({})
  //perpendicular.vx = nx
  //perpendicular.vy = -ny

  return
}
