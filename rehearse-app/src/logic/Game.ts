import { NoteInterface, NoteJSON } from '@tonejs/midi/dist/Note';
import {
	AmbientLight,
	AxesHelper,
	Camera,
	DirectionalLight,
	DoubleSide,
	Fog,
	Group,
	Material,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	PointLight,
	Scene,
	Vector3,
	WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createGradientMesh } from './Gradient';
import { Note } from './Note';
import { MidiJSON } from '@tonejs/midi';
import { SquareSpiral } from './decor/SquareSpiral';
import { Beam } from './decor/Beam';
import { Ref, ref } from 'vue';

// Calculates the x position of the lane based on the lane number and width
function calculateLaneX(lane: number, width: number, numLanes: number): number {
	const halfWidth = numLanes * width / 2;
	return lane * width - halfWidth;
}

class Lane {
	constructor(private scene: Scene, x: number, level: number) {
		this.scene = scene;
		const material = new MeshBasicMaterial({ color: 0xcfe0c3, side: DoubleSide });
		this.scene.add(this.newLane(x, level, material));
	}

	newLane(x: number, y: number, material: Material) {
		const geometry = new PlaneGeometry(0.2, 1000);
		const plane = new Mesh(geometry, material);
		plane.position.y = y;
		plane.position.x = x;
		plane.rotation.x = Math.PI / 2;
		return plane;
	}
}

export class Game {
	scene: Scene;
	renderer: WebGLRenderer;
	camera: Camera;
	noteGroup: Group;
	noteObjects: Note[] = [];
	squareSpiral: SquareSpiral;
	playing: boolean;
	lastTick?: number;
	bpm?: number;
	scrollSpeed = 1;
	startOffset = 400;
	judgementLinePosition = 12;
	judgementLineObject: Mesh;
	timeElapsed = -this.startOffset;
	animationFrame = 0;
	keyHighlights: Record<number, Mesh> = {};
	heldKeys: Set<number> = new Set();

	constructor(
		public canvas: HTMLCanvasElement,
		public laneCount: number,
		public laneWidth: number,
		public score: Ref<number>,
		public combo: Ref<number>
	) {
		this.playing = false;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		this.canvas = canvas;
		this.scene = new Scene();

		this.scene.add(new AmbientLight(0x404040));
		const pointLight = new DirectionalLight(0xffffff, 100);
		pointLight.position.set(1, 0, 0);
		this.scene.add(pointLight);

		const fogColor = 0x1b1e29;
		const backgroundColor = 0x13141a;
		this.scene.add(createGradientMesh(fogColor, backgroundColor));
		this.judgementLineObject = this.newJudgementLine();
		this.scene.add(this.judgementLineObject);
		this.scene.fog = new Fog(fogColor, 0.01, 200);

		this.camera = new PerspectiveCamera(60, width / height, 0.1, 1000);
		this.camera.lookAt(new Vector3(0, -4, 0));
		new OrbitControls(this.camera, this.canvas);

		this.squareSpiral = new SquareSpiral(0, 0, -80, 900, 8);
		this.scene.add(...this.squareSpiral.rings);

		this.noteGroup = new Group();

		for (let i = 0; i < laneCount + 1; i++) {
			new Lane(this.scene, calculateLaneX(i, laneWidth, laneCount), -5);
			this.keyHighlights[i] = this.newHighlight(i);
			this.scene.add(this.keyHighlights[i]);
		}

		this.camera.position.z = 2;
		this.renderer = new WebGLRenderer({ canvas: this.canvas });
		this.renderer.setClearColor(0x13141a, 1);
		this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
	}

	loadMidi(data: MidiJSON) {
		this.bpm = data.header.tempos[0].bpm;
		data.tracks.forEach((track) => {
			track.notes.forEach((noteData) => {
				const note = new Note(
					noteData as NoteInterface,
					(noteData.midi % 12) * this.laneWidth,
					-noteData.time * data.header.tempos[0].bpm * this.scrollSpeed,
					this.laneWidth,
					this.laneCount,
					noteData.midi % 12
				);
				this.noteObjects.push(note);
				this.noteGroup.add(note.mesh);
			});
		});
		this.scene.add(this.noteGroup);
		this.noteGroup.position.z -= this.startOffset + this.judgementLinePosition;
	}

	newJudgementLine() {
		const material = new MeshBasicMaterial({ color: 0xe0d8c3, side: DoubleSide });
		const geometry = new PlaneGeometry(this.laneWidth * this.laneCount, 0.3);
		const mesh = new Mesh(geometry, material);
		mesh.position.z = -this.judgementLinePosition;
		mesh.position.y = -5;
		mesh.rotation.x = Math.PI / 2;
		return mesh;
	}

	newHighlight(laneNum: number) {
		const material = new MeshBasicMaterial({ color: 0xcfe0c3, side: DoubleSide });
		material.transparent = true;
		material.opacity = 0;
		const geometry = new PlaneGeometry(this.laneWidth, 10000);
		const mesh = new Mesh(geometry, material);
		mesh.rotation.x = Math.PI / 2;
		mesh.position.y = -5;
		mesh.position.x = calculateLaneX(laneNum, this.laneWidth, this.laneCount) + this.laneWidth / 2;
		return mesh;
	}

	keyDown(laneNum: number) {
		const key = this.keyHighlights[laneNum];
		const mat = key.material! as Material;
		mat.opacity = 0.2;
		this.heldKeys.add(laneNum);
	}

	keyUp(laneNum: number) {
		const key = this.keyHighlights[laneNum];
		const mat = key.material! as Material;
		mat.opacity = 0;
		this.heldKeys.delete(laneNum);
	}

	start() {
		this.playing = true;
		this.animationFrame = requestAnimationFrame((time) => this.update(time));
	}

	stop() {
		cancelAnimationFrame(this.animationFrame);
		this.playing = false;
	}

	toggle() {
		if (this.playing) {
			this.stop();
		} else {
			this.start();
		}
	}

	checkInput() {
		// VERY naive way of doing this
		const targetNotes = this.noteObjects.reduce<Note[]>((acc, note) => {
			const actualPosition = this.noteGroup.position.z + note.z;
			const distFromJudgement = Math.abs(actualPosition - this.judgementLineObject.position.z);
			if (actualPosition >= this.judgementLineObject.position.z && distFromJudgement < 20) {
				acc.push(note);
			}
			return acc;
		}, []);
		const missedNotes = targetNotes.reduce<Note[]>((acc, note) => {
			if (!this.heldKeys.has(note.laneNum)) {
				acc.push(note);
			}
			return acc;
		}, []);
		if (missedNotes.length > 0) {
			this.combo.value = 0;
			missedNotes.forEach((note) => (note.mesh.material as MeshBasicMaterial).color.set(0xff0000));
			(this.judgementLineObject.material as MeshBasicMaterial).color.set(0xff0000);
		} else if (targetNotes.length > 0) {
			const newHits = targetNotes.filter((note) => !note.hit);
			this.combo.value += newHits.length;
			this.score.value += newHits.length * 10 * this.combo.value;
			newHits.forEach((note) => (note.hit = true));
			(this.judgementLineObject.material as MeshBasicMaterial).color.set(0x00ff00);
		} else {
			(this.judgementLineObject.material as MeshBasicMaterial).color.set(0xe0d8c3);
		}
	}

	update(time: number) {
		const diff = time - (this.lastTick || time);
		this.lastTick = time;
		this.timeElapsed += diff;
		this.squareSpiral.tick();
		this.animationFrame = requestAnimationFrame((time) => this.update(time));
		this.playing && (this.noteGroup.position.z += diff * this.scrollSpeed / 10);
		this.renderer.render(this.scene, this.camera);
		this.checkInput();
	}
}
