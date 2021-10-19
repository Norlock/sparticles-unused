// How the particles should be filled in a voxel 
export enum FillStyle {
  TOP_HORIZONTAL_LEFT,
  TOP_HORIZONTAL_RIGHT,
  TOP_VERTICAL_LEFT,
  TOP_VERTICAL_RIGHT,
  BOTTOM_HORIZONTAL_LEFT,
  BOTTOM_HORIZONTAL_RIGHT,
  BOTTOM_VERTICAL_LEFT,
  BOTTOM_VERTICAL_RIGHT,
  WHITE_NOISE,
  BLUE_NOISE
}

export interface FillAttributes {
  particleCount: number
  fillStyle: FillStyle
}
