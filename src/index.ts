import * as PIXI from 'pixi.js'
import {Position} from './position';
import {Grid} from './grid'
import {ParticleAttributes} from './particle';
import {PixiParticleContainer} from './particleContainer';
import {PixiParticleContainerFactory} from './particleContainerFactory';
import {PixiGraphicalEntityFactory} from './pixiGraphicalEntity';
import {fillParticles} from './fillParticles';

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
  const coordinates = new Position({x: 100, y: 100})

  const grid = new Grid({
    factory: containerFactory,
    coordinates,
    cellXCount: 5,
    cellYCount: 5,
    cellDiameter: 100
  })

  const particleAttributes: ParticleAttributes = {
    color: {
      red: 255,
      blue: 100,
      green: 0
    },
    weight: 1,
    spacing: 6,
    diameter: 4
  }

  const fill = fillParticles(grid, particleAttributes, PixiGraphicalEntityFactory())
  fill.blueNoise(3)

  grid.start()

  app.stage.addChild(grid.container as PixiParticleContainer)
}

initGrid()
