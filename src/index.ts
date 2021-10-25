import * as PIXI from 'pixi.js'
import {Grid} from './grid'
import {ParticleAttributes} from './particle';
import {PixiParticleContainer} from './particleContainer';
import {PixiParticleContainerFactory} from './particleContainerFactory';
import {PixiGraphicalEntityFactory} from './pixiGraphicalEntity';

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
    probabilityXCount: 20,
    probabilityYCount: 15,
    probabilityDiameter: 10,
    position: {
      x: 100,
      y: 100
    }
  }, containerFactory)

  const attributes: ParticleAttributes = {
    color: {
      red: 255,
      blue: 100,
      green: 0
    },
    weight: 1,
    diameter: 5
  }

  app.stage.addChild(grid.container as PixiParticleContainer)

  const fill = grid.fill(attributes, PixiGraphicalEntityFactory())
  fill.blueNoise(10)

  setTimeout(() => grid.start(), 3000)
}

initGrid()
