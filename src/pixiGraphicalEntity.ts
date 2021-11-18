import * as PIXI from "pixi.js"
import {Particle} from "./particle"
import {GraphicalEntity, GraphicalEntityFactory} from "./graphicalEntity"

class PixiGraphicalEntity implements GraphicalEntity {
  mesh: PIXI.Mesh<PIXI.Shader>

  constructor(particle: Particle) {
    this.mesh = createMesh(particle)
  }
}

const createMesh = (particle: Particle) => {
  const {color} = particle
  const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100]);

  const redFraction = color.red / 255
  const greenFraction = color.green / 255
  const blueFraction = color.blue / 255

  const shader = PIXI.Shader.from(`
    precision mediump float;
    attribute vec2 aVertexPosition;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    void main() {
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`,

    `precision mediump float;

    void main() {
        gl_FragColor = vec4(` + redFraction + ',' + greenFraction + ',' + blueFraction + `, 1.0);
    }
`);

  const triangle = new PIXI.Mesh(geometry, shader);
  triangle.x = particle.x
  triangle.y = particle.y
  triangle.width = particle.diameter
  triangle.height = particle.diameter
  return triangle
}

export const PixiGraphicalEntityFactory = (): GraphicalEntityFactory => {
  const create = (particle: Particle): GraphicalEntity => {
    return new PixiGraphicalEntity(particle)
  }

  return {create}
}
