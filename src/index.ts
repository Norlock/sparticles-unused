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
    forces: createForces()
  }, containerFactory)

  const attributes: ParticleAttributes = {
    color: {
      red: 255,
      blue: 0,
      green: 255
    },
    weight: 1,
    diameter: 5
  }

  app.stage.addChild(grid.container as PixiParticleContainer)

  const fill = grid.fill(attributes, PixiGraphicalEntityFactory())
  fill.blueNoise(20, fireflies)

  setTimeout(() => grid.start(), 3000)
}

const createForces = () => {
  const force1 = new ExternalForce()
  force1.vx = 0.5
  force1.vy = 0
  force1.type = "dynamic"
  force1.firstFrame = 0
  force1.lastFrame = 14 * 15

  const force2 = new ExternalForce()
  force2.vx = -1
  force2.vy = 0
  force2.type = "dynamic"
  force2.firstFrame = 20 * 15
  force2.lastFrame = 34 * 15

  return [force1, force2]
}

initGrid()
