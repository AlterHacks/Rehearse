import { NoteInterface } from '@tonejs/midi/dist/Note';
import { AmbientLight, AxesHelper, Camera, DirectionalLight, DoubleSide, Fog, Group, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createGradientMesh } from './Gradient'
import { Note } from './Note';
import { MidiJSON } from '@tonejs/midi';

// Calculates the x position of the lane based on the lane number and width
function calculateLaneX(lane: number, width: number, numLanes: number): number {
  const halfWidth = (numLanes * width) / 2;
  return lane * width - halfWidth
}

class Lane {
  constructor(
    private scene: Scene,
    x: number,
    level: number,
  ) {
    this.scene = scene;
    const material = new MeshBasicMaterial({ color: 0xCFE0C3, side: DoubleSide })
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
  playing: boolean;
  lastTick?: number;
  bpm?: number;
  scrollSpeed = 1;
  judgementLinePosition = 20
  keyHighlights: Record<number, Mesh> = {};

  constructor(
    public canvas: HTMLCanvasElement,
    public laneCount: number,
    public laneWidth: number,
  ) {
    this.playing = false
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    this.canvas = canvas
    this.scene = new Scene();

    this.scene.add(new AxesHelper(1));

    this.scene.add(new AmbientLight( 0x404040 ));
    const pointLight = new DirectionalLight( 0xffffff, 100)
    pointLight.position.set( 1, 0, 0 );
    this.scene.add(pointLight);

    const fogColor = 0x21373d;
    const backgroundColor = 0x13141a;
    this.scene.add(createGradientMesh(fogColor, backgroundColor));
    this.scene.fog = new Fog(fogColor, 0.01, 200);

    this.camera = new PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000,
    );

    new OrbitControls(this.camera, this.canvas);
    
    this.noteGroup = new Group();
    this.noteGroup.position.z += this.judgementLinePosition

    for (let i = 0; i < laneCount + 1; i++) {
      new Lane(this.scene, calculateLaneX(i, laneWidth, laneCount), -5)     
      this.keyHighlights[i] = this.newHighlight(i)
      this.scene.add(this.keyHighlights[i])
    }

    this.camera.position.z = 2;
    this.renderer = new WebGLRenderer({ canvas: this.canvas })
    this.renderer.setClearColor( 0x13141a, 1 );
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
  }

  loadMidi(data: MidiJSON) {
    this.bpm = data.header.tempos[0].bpm
    data.tracks.forEach(track => {
      track.notes.forEach(noteData => {
        console.log(noteData.midi)
        const note = new Note(
          noteData as NoteInterface,
          (noteData.midi % 12) * this.laneWidth,
          -noteData.time * data.header.tempos[0].bpm * this.scrollSpeed,
          this.laneWidth,
          this.laneCount,
        )
        this.noteGroup.add(note.mesh)
      })
    })
    this.scene.add(this.noteGroup)
  }

  newHighlight(laneNum: number) {
    const material = new MeshBasicMaterial({ color: 0xCFE0C3, side: DoubleSide })
    material.transparent = true;
    material.opacity = 0;
    const geometry = new PlaneGeometry(this.laneWidth, 10000);
    const mesh = new Mesh(geometry, material)
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = -5;
    mesh.position.x = calculateLaneX(laneNum, this.laneWidth, this.laneCount) + this.laneWidth / 2;
    return mesh
  }

  keyDown(laneNum: number) {
    const key = this.keyHighlights[laneNum];
    const mat = key.material! as Material; 
    mat.opacity = 0.2;
  }

  keyUp(laneNum: number) {
    const key = this.keyHighlights[laneNum];
    const mat = key.material! as Material; 
    mat.opacity = 0;
  }

  start() {
    const song = new Audio('/Golden_Wind.mp3')
    song.play()
    this.playing = true
    requestAnimationFrame((time) => this.update(time))
  }

  pause() {
    this.playing = false
  }

  toggle() {
    if (this.playing) {
      this.pause()
    } else {
      this.start()
    }
  }

  update(time: number) {
    const diff = time - (this.lastTick || 0)
    this.lastTick = time
    requestAnimationFrame((time) => this.update(time))
    this.playing && (this.noteGroup.position.z += (diff * this.scrollSpeed) / 10);
    this.renderer.render(this.scene, this.camera)
  }
}
