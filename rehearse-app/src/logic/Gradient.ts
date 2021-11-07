import { Color, PlaneBufferGeometry, ShaderMaterial, Mesh } from 'three';
import vertexShader from './shaders/gradient/gradient.vert';
import fragmentShader from './shaders/gradient/gradient.frag';

// radial gradient mesh
export function createGradientMesh(colorInner: number, colorOuter: number) {
  const grad = new Mesh(
      new PlaneBufferGeometry(5, 5, 10, 10),
      new ShaderMaterial({
        uniforms: {
            uColorA: {value: new Color(colorInner)},
            uColorB: {value: new Color(colorOuter)},
            widthHeightRatio: { value: innerWidth / innerHeight }    
        },
        vertexShader,
        fragmentShader
      }))

  grad.material.depthWrite = false
  grad.renderOrder = -99999

  return grad
}