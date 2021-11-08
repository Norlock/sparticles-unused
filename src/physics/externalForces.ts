import {Grid, Spot} from "src/grid";
import {Particle} from "src/particle";
import {Point} from "src/position";

// static means the force is applied to each particle (e.g. falling down)
// dynamic means the force collides with particles and have residual effect (e.g. wind blowing)  
type ForceType = "static" | "dynamic"

export class BaseForce {
  vx: number;
  vy: number;
  vz?: number;
}

// TODO in future you can apply external force on partial space inside the grid
export class ExternalForce extends BaseForce {
  //x: number;
  //y: number;
  //z?: number;
  //width: number;
  //height: number;

  // dispersion if set will start from a point and disperse in percentage over length

  firstFrame: number;
  lastFrame: number;
  type: ForceType
}

const applyForce = (grid: Grid, force: ExternalForce) => {
  if (force.vx < 0) {
    // check from right to left
    console.log('komt hier L')
    applyLeftForce(grid, force)
  } else if (0 < force.vx) {
    // check from left to right
    console.log('komt hier R')
  }
}

const applyLeftForce = (grid: Grid, force: ExternalForce) => {
  const {probabilityDiameter} = grid.options

  // TODO
  // get most top left spot.
  // go recursively to the right ordering the particles
  // 
  // |-x(a,b)-x(a,c)-x(b)-|
  // 
  // will go  x(a)-> x(a) -> x(b) -> x(c)
  //
  // calculate positions inside spot that have been hit. 
  // 
  // Particle 1 goes from 0.2 y to 0.5 y, next particle goes from 0.1 to 0.3 will
  // result in 0.1 to 0.5 y. the particle after this one, wont apply external force anymore if it resides in the 0.1
  // till 0.5 range.
  //
  // In future certain angle/direction can be applied if only top or bottom is hit by the external force.

}
