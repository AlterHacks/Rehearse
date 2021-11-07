import { Mesh, MeshBasicMaterial, RingGeometry } from 'three';

export class SquareSpiral {
	rings: Mesh[] = [];

	constructor(public x: number, public y: number, public z: number, public size: number, numSquares: number) {
		const mat = new MeshBasicMaterial({ color: 0x3d404d });
		for (let i = 0; i < numSquares; i++) {
			const currentRingSize = size / (i * 4);
			const square = new RingGeometry(currentRingSize - 1, currentRingSize, 4);
			square.rotateZ(i / 40);
			const mesh = new Mesh(square, mat);
			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z += z - 20 * i;
			this.rings.push(mesh);
		}
	}

	tick() {
		this.rings.forEach((ring, i) => {
			ring.rotateZ(0.001 * i);
		});
	}
}
