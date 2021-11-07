import { PlaneGeometry, MeshBasicMaterial, Mesh } from 'three';
export class Beam {
	mesh: Mesh;

	constructor(public x: number, public y: number, public z: number, public width: number, public color: number) {
		const mat = new MeshBasicMaterial({ color: color });
		const geo = new PlaneGeometry(width, 10000, 1, 1);
		this.mesh = new Mesh(geo, mat);
		this.mesh.position.set(x, y, z);
		this.mesh.rotation.z = 0.4;
	}
}
