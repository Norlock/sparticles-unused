import * as PIXI from 'pixi.js'
//import * as THREE from 'three'
import {Particle} from './particle'
import {Point} from './position'

export interface ParticleContainer {
  add(particle: Particle): void
  remove(particle: Particle): void
  render(): void
}

export class PixiParticleContainer extends PIXI.Container implements ParticleContainer {
  renderer: PIXI.Renderer

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
