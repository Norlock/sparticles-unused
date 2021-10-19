import * as PIXI from 'pixi.js'
import {Coordinates} from './coordinates';
import {FillAttributes, FillStyle} from './fillAttributes';
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
  const coordinates = new Coordinates(10, 10)

  const grid = new Grid({
    factory: containerFactory,
    coordinates,
    cellXCount: 5,
    cellYCount: 5,
    cellDiameter: 100
  })

  const fillAttributes: FillAttributes = {
    particleCount: 51,
    fillStyle: FillStyle.TOP_HORIZONTAL_RIGHT
  }

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

  grid.addParticles(fillAttributes, particleAttributes, PixiGraphicalEntityFactory())

  grid.start()

  app.stage.addChild(grid.container as PixiParticleContainer)
}

initGrid()
