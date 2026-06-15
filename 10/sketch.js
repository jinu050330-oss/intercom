let t = 0;

let scl = 18;
let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noStroke();

  cols = floor(width / scl);
  rows = floor(height / scl);
}

function draw() {
  background(245, 243, 238);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let px = x * scl + scl / 2;
      let py = y * scl + scl / 2;

      let n1 = noise(x * 0.06, y * 0.06, t * 1.4);
      let n2 = noise(x * 0.11 + 100, y * 0.11, t * 1.9);
      let n3 = noise(x * 0.04 + 300, y * 0.04 + 300, t);

      let wave =
        sin(x * 0.35 + t * 4.0) +
        cos(y * 0.28 + t * 3.2);

      let size = map(n1, 0, 1, 3, 24) + wave * 3;
      size = max(size, 1);

      let alpha = map(n2, 0, 1, 35, 230);

      let ellipseRatio = map(n3, 0, 1, 0.35, 2.4);

      let w = size * ellipseRatio;
      let h = size / ellipseRatio;

      let angle =
        noise(x * 0.05 + 500, y * 0.05, t * 1.5) *
        TWO_PI *
        2;

      let c = getDynamicColor(x, y, n1, n2, alpha);

      fill(c);

      push();

      translate(px, py);
      rotate(angle);

      ellipse(0, 0, w, h);

      pop();
    }
  }

  t += 0.018;
}

function getDynamicColor(x, y, n1, n2, alphaValue) {
  let c1 = color(8, 23, 85, alphaValue);
  let c2 = color(25, 70, 160, alphaValue);
  let c3 = color(170, 42, 86, alphaValue);
  let c4 = color(230, 86, 95, alphaValue);
  let c5 = color(190, 215, 215, alphaValue);
  let c6 = color(238, 232, 205, alphaValue);

  let m =
    noise(x * 0.018, y * 0.018, t * 0.9) +
    sin(x * 0.07 + t * 2.0) * 0.25 +
    cos(y * 0.06 - t * 1.7) * 0.25;

  m = constrain(m, 0, 1);

  if (m < 0.16) {
    return lerpColor(c1, c2, map(m, 0, 0.16, 0, 1));
  } else if (m < 0.34) {
    return lerpColor(c2, c3, map(m, 0.16, 0.34, 0, 1));
  } else if (m < 0.52) {
    return lerpColor(c3, c4, map(m, 0.34, 0.52, 0, 1));
  } else if (m < 0.72) {
    return lerpColor(c4, c5, map(m, 0.52, 0.72, 0, 1));
  } else {
    return lerpColor(c5, c6, map(m, 0.72, 1, 0, 1));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
}