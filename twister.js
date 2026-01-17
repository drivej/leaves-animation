export class Twister {
  constructor(a) {
    this.position = { x: 0, y: 0 };
    this.center = { x: 0, y: 0 };
    this.crawl = { x: 0, y: 0 };
    this.trail = [];
    this.data = {};
    this.onEnterFrame = () => {};
    this.data_array = a;

    this._rad = Math.PI / 180;
    this._alive = true;

    for (let i = 0; i < this.data_array.length; i++) {
      const def = {
        angle: Math.random() * 360,
        radius: Math.random() * 50,
        speed: -20 + (Math.random() * 40),
        scalar: 1,
      };
      for (const key in def) {
        if (this.data_array[i][key] === undefined) this.data_array[i][key] = def[key];
      }
    }
  }

  render() {
    if (!this._alive) return this.position;

    this.position = { x: this.center.x, y: this.center.y };
    let radius_total = 0;

    for (const d of this.data_array) {
      d.angle += d.speed;
      d.angle %= 360;
      d.radius *= d.scalar;

      radius_total += d.radius;

      const ang = d.angle * this._rad;
      this.position = {
        x: this.position.x + Math.cos(ang) * d.radius,
        y: this.position.y + Math.sin(ang) * d.radius,
      };
    }

    this.trail.unshift({ x: this.position.x, y: this.position.y });
    if (this.trail.length > 30) this.trail.length = 30;

    this.onEnterFrame(this);

    if (radius_total < 0.1) this.die();
    return this.position;
  }

  die() { this._alive = false; }
  get alive() { return this._alive; }
}
