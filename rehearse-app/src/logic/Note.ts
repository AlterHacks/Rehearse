import { NoteInterface } from '@tonejs/midi/dist/Note'
import { DoubleSide, Mesh, MeshBasicMaterial, Scene, BoxGeometry } from 'three';

export class Note {
  mesh: Mesh;

  constructor(
    public note: NoteInterface,
    public x: number,
    public z: number,
    public laneWidth: number,
    public laneCount: number,
    public padding: number = 0.4
  ) {
    if (note.duration > 0.2) {
      this.mesh = this.newHoldNote()
    } else {
      this.mesh = this.newShortNote()
    }
  }

  calculateX() {
    return (this.x - (this.laneCount * this.laneWidth) / 2) - this.laneWidth / 2 
  }

  private newHoldNote() {
    const geometry = new BoxGeometry(
      this.laneWidth - (this.padding || 0),
      0,
      this.note.duration * 40,
    );
    const material = new MeshBasicMaterial({ color: 0x67e8f9, side: DoubleSide })
    const cube = new Mesh(geometry, material);
    cube.position.x = this.calculateX();
    cube.position.y = -5;
    cube.position.z = this.z;
    return cube;
  }

  private newShortNote() {
    const size = this.laneWidth - (this.padding || 0);
    const geometry = new BoxGeometry(
      size,
      0.4,
      size
    );
    const material = new MeshBasicMaterial({ color: 0x9EC1A3, side: DoubleSide })
    const cube = new Mesh(geometry, material);
    cube.position.x = this.calculateX();
    cube.position.y = -2;
    cube.position.z = this.z;
    return cube
  }
}
