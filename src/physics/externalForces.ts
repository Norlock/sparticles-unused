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
