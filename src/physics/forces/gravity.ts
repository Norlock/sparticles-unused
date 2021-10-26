import {Force} from "../force"

export const gravity = (): Force => {
  return {
    delay: 0,
    frameIteration: 1,
    vy: 2
  }
}
