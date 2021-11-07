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