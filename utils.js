export const RAD = Math.PI / 180;

export function randomFloat(n1, n2) {
  return Math.random() * (n2 - n1) + n1;
}

function randomGear(maxRadius = 100) {
  return {
    r: randomFloat(maxRadius * 0.2, maxRadius),
    a: randomFloat(0, Math.PI * 2),
    s: randomFloat(-0.05, 0.05)
  };
}

export function randomGears(maxGears = 4, maxRadius = 100) {
  const n = Math.floor(randomFloat(2, maxGears));
  const gears = [];
  for (let i = 0; i < n; i++) {
    gears.push(randomGear(maxRadius));
  }
  return gears;
}

export function tickGears(gears) {
  const p = { x: 0, y: 0 };
  for (const g of gears) {
    g.a += g.s;
    p.x += Math.cos(g.a) * g.r;
    p.y += Math.sin(g.a) * g.r;
  }
  return p;
}

/**
 * Interpolate between two hex colors
 * @param {number} color1 - First color as hex (e.g., 0xFF33CC)
 * @param {number} color2 - Second color as hex (e.g., 0xAACCFF)
 * @param {number} t - Interpolation factor (0 = color1, 1 = color2)
 * @returns {number} Interpolated color as hex
 */
export function lerpColor(color1, color2, t) {
  // Clamp t between 0 and 1
  t = Math.max(0, Math.min(1, t));

  // Extract RGB components from color1
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;

  // Extract RGB components from color2
  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  // Interpolate each component
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  // Combine back into hex
  return (r << 16) | (g << 8) | b;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
