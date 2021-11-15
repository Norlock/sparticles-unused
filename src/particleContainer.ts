import * as PIXI from 'pixi.js'
import {GridOptions} from './grid'
//import * as THREE from 'three'
import {Particle} from './particle'
import {Point} from './position'

export interface ParticleContainer {
  add(particle: Particle): void
  remove(particle: Particle): void
  render(): void
  drawDevGrid(options: GridOptions): void

  showDevGrid(): void
  hideDevGrid(): void
}

export class PixiParticleContainer extends PIXI.Container implements ParticleContainer {
  renderer: PIXI.Renderer
  devGrid: PIXI.Graphics

  constructor(coordinates: Point, renderer: PIXI.Renderer) {
    super()
    this.x = coordinates.x
    this.y = coordinates.y
    this.zIndex = coordinates.z
    this.renderer = renderer
  }

  add(particle: Particle): void {
    this.addChild(particle.graphicalEntity.mesh as PIXI.Mesh)
  }

  remove(particle: Particle): void {
    this.removeChild(particle.graphicalEntity.mesh as PIXI.Mesh)
  }

  render() {
    super.render(this.renderer)
  }

  drawDevGrid(options: GridOptions) {
    const {cellXCount, cellYCount, possibilityXCount: probabilityXCount, possibilityYCount: probabilityYCount, probabilityDiameter} = options
    const xCount = cellXCount * probabilityXCount
    const yCount = cellYCount * probabilityYCount

    this.devGrid = new PIXI.Graphics()

    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        let color: number
        if (x % probabilityXCount === 0 || y % probabilityYCount === 0) {
          color = 0x5555ff
        } else {
          color = 0xffffff
        }

        this.devGrid
          .lineStyle(1, color, 0.1)
          .drawRect(x * probabilityDiameter, y * probabilityDiameter, probabilityDiameter, probabilityDiameter)

      }
    }

    this.addChild(this.devGrid)
  }

  showDevGrid() {
    this.devGrid.visible = true
  }

  hideDevGrid() {
    this.devGrid.visible = false
  }
}

//export class ThreeParticleContainer implements ParticleContainer {
  //scene: THREE.Scene
  //camera: THREE.Camera
  //renderer: THREE.Renderer
  //coordinates: Coordinates

  //constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer) {
    //this.scene = scene
    //this.camera = camera
    //this.renderer = renderer
  //}

  //add(particle: Particle): void {
    //this.scene.add(particle.graphicalEntity.mesh)
  //}

  //remove(particle: Particle): void {
    //this.scene.remove(particle.graphicalEntity.mesh)
  //}

  //render() {
    //this.renderer.render(this.scene, this.camera)
  //}
//}
