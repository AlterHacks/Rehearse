import { AmbientLight, AxesHelper, BoxGeometry, Camera, DirectionalLight, DoubleSide, Fog, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GoldenWind from '../assets/midi/golden_wind.json'

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
    const geometry = new PlaneGeometry(0.2, 100);
    const plane = new Mesh(geometry, material);
    plane.position.y = y;
    plane.position.x = x;
    plane.rotation.x = Math.PI / 2;
    return plane;
  }
}

class HoldNote {
  cube: Mesh;

  constructor(
    private scene: Scene,
    x: number,
    y: number,
    z: number,
    size: number,
    laneWidth: number,
  ) {
    this.scene = scene;
    const geometry = new BoxGeometry(
      laneWidth,
      0,
      size
    );
    const material = new MeshBasicMaterial({ color: 0x40798C, side: DoubleSide })
    this.cube = new Mesh(geometry, material);
    this.cube.position.x = x - size / 2;
    this.cube.position.y = y;
    this.cube.position.z = z;
    this.scene.add(this.cube)
  }
}

class Cube {
  cube: Mesh;

  constructor(
    private scene: Scene,
    x: number,
    y: number,
    z: number,
    size: number,
  ) {
    this.scene = scene;
    const geometry = new BoxGeometry(
      size,
      size,
      size
    );
    const material = new MeshBasicMaterial({ color: 0x9EC1A3, side: DoubleSide })
    this.cube = new Mesh(geometry, material);
    this.cube.position.x = x - size / 2;
    this.cube.position.y = y;
    this.cube.position.z = z;
    this.scene.add(this.cube)
  }
}

export class Game {
  canvas: HTMLCanvasElement
  scene: Scene;
  renderer: WebGLRenderer;
  camera: Camera;

  constructor(
    canvas: HTMLCanvasElement,
    numLanes: number,
    laneWidth: number,
  ) {
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    this.canvas = canvas
    this.scene = new Scene();
    

    this.scene.add(new AxesHelper(1));

    this.scene.add(new AmbientLight( 0x404040 ));
    const pointLight = new DirectionalLight( 0xffffff, 100)
    pointLight.position.set( 1, 0, 0 );
    this.scene.add(pointLight);

    this.scene.fog = new Fog(0x13141a, 0.001, 50);

    this.camera = new PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000,
    );

    new OrbitControls(this.camera, this.canvas);

    for (let i = 0; i < numLanes + 1; i++) {
      new Lane(this.scene, calculateLaneX(i, laneWidth, numLanes), -5)     
    }

    this.camera.position.z = 2;
    this.renderer = new WebGLRenderer({ canvas: this.canvas })
    this.renderer.setClearColor( 0x13141a, 1 );
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
  }

  async loadMidi(path: string) {
    const data = GoldenWind // TODO: load from path
    data.tracks.forEach(track => {
      track.notes.forEach(note => {
        if (note.duration > 0.12) {
          new HoldNote(
            this.scene, 
            calculateLaneX(note.midi % 12, 1, 4),
            -1,
            -note.time * 12,
            note.duration * 10,
            
          )
        } else {
          new Cube(
            this.scene, 
            calculateLaneX(note.midi % 12, 1, 4),
            -1,
            -note.time * 12,
            1
          )
        }
        
      })
    })
  }

  start() {
    this.update()
  }

  update() {
    requestAnimationFrame(() => this.update())
    // this.cube.position.z += 1;
    this.renderer.render(this.scene, this.camera)
  }
}