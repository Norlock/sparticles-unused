import * as PIXI from 'pixi.js'
import {Grid} from './grid'
import {ParticleAttributes} from './particle';
import {PixiParticleContainer} from './particleContainer';
import {PixiParticleContainerFactory} from './particleContainerFactory';
import {PixiGraphicalEntityFactory} from './pixiGraphicalEntity';
import {fireflies} from './physics/forces/patterns';
import {ExternalForce} from './physics/externalForces';

const canvas = document.getElementById('canvas')

export const app = new PIXI.Application({
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  width: window.innerWidth,
  height: window.innerHeight,
})

canvas.append(app.view);

const initGrid = () => {
  const containerFactory = PixiParticleContainerFactory(app.renderer as PIXI.Renderer)
  const grid = new Grid({
    cellXCount: 5,
    cellYCount: 5,
    possibilityXCount: 15,
    possibilityYCount: 15,
    probabilityDiameter: 10,
    position: {
      x: 100,
      y: 100
    },
    showUI: true,
  }, containerFactory)
  grid.setExternalForces(externalForces(grid))

  const attributes: ParticleAttributes = {
    color: {
      red: 255,
      blue: 0,
      green: 255
    },
    weight: 1,
    diameter: 5,
    decay: 0.01
  }

  app.stage.addChild(grid.container as PixiParticleContainer)

  const fill = grid.fill(attributes, PixiGraphicalEntityFactory())
  fill.blueNoise(20, fireflies)
  //fill.blueNoise(20)

  setTimeout(() => grid.start(), 3000)
}

const externalForces = (grid: Grid) => {
  const force1 = new ExternalForce(grid, {
    vx: 0.5,
    vy: 0,
    type: "dynamic",
    firstFrame: 0,
    lastFrame: 7 * 15
  })

  const force2 = new ExternalForce(grid, {
    vx: 0,
    vy: -1,
    type: "dynamic",
    firstFrame: 20 * 15,
    lastFrame: 27 * 15
  })

  return [force1, force2]
}

initGrid()
