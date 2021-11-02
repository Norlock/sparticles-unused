import * as PIXI from 'pixi.js'
import {Grid} from './grid'
import {ParticleAttributes} from './particle';
import {PixiParticleContainer} from './particleContainer';
import {PixiParticleContainerFactory} from './particleContainerFactory';
import {PixiGraphicalEntityFactory} from './pixiGraphicalEntity';
import {bouncingBalls} from './physics/forces/patterns';

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
    probabilityXCount: 15,
    probabilityYCount: 15,
    probabilityDiameter: 10,
    position: {
      x: 100,
      y: 100
    },
    showUI: true
  }, containerFactory)

  const attributes: ParticleAttributes = {
    color: {
      red: 255,
      blue: 0,
      green: 255
    },
    weight: 1,
    diameter: 8
  }

  app.stage.addChild(grid.container as PixiParticleContainer)

  const fill = grid.fill(attributes, PixiGraphicalEntityFactory())
  fill.blueNoise(1, bouncingBalls)

  setTimeout(() => grid.start(), 3000)
}

initGrid()
