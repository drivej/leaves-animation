export class Pointer {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.position = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.offsetNormalized = { x: 0, y: 0 };
    this.positionNormalized = { x: 0, y: 0 };
    window.addEventListener('pointermove', this.onMove.bind(this));
  }

  onMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    this.position.x = e.clientX;
    this.position.y = e.clientY;
    this.positionNormalized.x = e.clientX / window.innerWidth;
    this.positionNormalized.y = e.clientY / window.innerHeight;
    this.offset.x = e.clientX - window.innerWidth / 2;
    this.offset.y = e.clientY - window.innerHeight / 2;
    this.offsetNormalized.x = this.offset.x / (window.innerWidth / 2);
    this.offsetNormalized.y = this.offset.y / (window.innerHeight / 2);
  }
}
