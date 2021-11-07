import { Color, PlaneBufferGeometry, ShaderMaterial, Mesh } from 'three';

const vertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv;
  float depth = -1.; //or maybe 1. you can experiment
  gl_Position = vec4(position.xy, depth, 1.);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float widthHeightRatio;
void main(){
    vec2 uv = (vUv - 0.5) * vec2(widthHeightRatio, 1.);
    float len = length(uv) / 0.5;
    gl_FragColor = vec4(
        mix(uColorA, uColorB, len),
        1.
    );
}
`;

// radial gradient mesh
export function createGradientMesh(colorInner: number, colorOuter: number) {
	const grad = new Mesh(
		new PlaneBufferGeometry(5, 5, 10, 10),
		new ShaderMaterial({
			uniforms: {
				uColorA: { value: new Color(colorInner) },
				uColorB: { value: new Color(colorOuter) },
				widthHeightRatio: { value: innerWidth / innerHeight }
			},
			vertexShader,
			fragmentShader
		})
	);

	grad.material.depthWrite = false;
	grad.renderOrder = -99999;

	return grad;
}
