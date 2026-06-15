let video;
let prevPixels;

let pixelSize = 14;
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(width / pixelSize, height / pixelSize);
  video.hide();

  prevPixels = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width / pixelSize, height / pixelSize);
}

function draw() {
  background(8, 8, 16, 35);
  video.loadPixels();

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let px = x * pixelSize + pixelSize / 2;
      let py = y * pixelSize + pixelSize / 2;

      let brightnessValue = (r + g + b) / 3;
      let baseSize = map(brightnessValue, 0, 255, 4, pixelSize * 1.1);

      let influence = 0;
      let waterMix = 0;
      let popSize = 0;
      let popAlpha = 1;
      let strongestRing = 0;

      for (let i = 0; i < ripples.length; i++) {
        let rp = ripples[i];
        let distTo = dist(px, py, rp.x, rp.y);

        let organic = noise(px * 0.02, py * 0.02, frameCount * 0.018);
        let wave = sin((distTo - rp.r) * 0.06 + organic * TWO_PI);

        let outer = constrain(map(distTo, rp.r - 160, rp.r + 160, 1, 0), 0, 1);
        let innerCut = constrain(map(distTo, rp.r - 260, rp.r - 80, 0, 1), 0, 1);

        // 🔥 더 날카로운 파동
        let ring = pow(outer * innerCut, 3.2);
        strongestRing = max(strongestRing, ring);

        influence += wave * ring * 34;
        waterMix += ring * rp.alpha * 0.45;

        // 🔥 중앙 도트 퍼짐
        let center = constrain(map(distTo, 0, 140, 1, 0), 0, 1);
        center = pow(center, 2.0) * rp.alpha;

        let dx = px - rp.x;
        let dy = py - rp.y;
        let angle = atan2(dy, dx);

        angle += (noise(px * 0.02, py * 0.02) - 0.5) * 0.8;

        let push = center * rp.pop * 12;

        px += cos(angle) * push;
        py += sin(angle) * push;

        popSize += center * rp.pop * 48;
        popAlpha *= 1 - center * rp.pop * 0.5;
      }

      waterMix = constrain(waterMix, 0, 0.42);

      let waterColor = color(
        0,
        160 + 70 * noise(px * 0.01, py * 0.01),
        255
      );

      let baseColor = color(r, g, b);

      // 🔥 핵심: 선명한 물결 라인
      let finalColor;
      if (strongestRing > 0.45) {
        finalColor = color(
          0,
          200 + 55 * noise(px * 0.01, py * 0.01),
          255
        );
      } else {
        finalColor = lerpColor(baseColor, waterColor, waterMix);
      }

      let finalAlpha = 220 * constrain(popAlpha, 0.15, 1);
      let finalSize = max(2, baseSize + influence + popSize);

      fill(red(finalColor), green(finalColor), blue(finalColor), finalAlpha);
      noStroke();
      circle(px, py, finalSize);
    }
  }

  let maxDiff = 0;
  let bestX = -1;
  let bestY = -1;

  for (let y = 0; y < video.height; y += 2) {
    for (let x = 0; x < video.width; x += 2) {
      let index = (x + y * video.width) * 4;

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      if (prevPixels[index] !== undefined) {
        let oldR = prevPixels[index];
        let oldG = prevPixels[index + 1];
        let oldB = prevPixels[index + 2];

        let diff = dist(r, g, b, oldR, oldG, oldB);

        if (diff > maxDiff) {
          maxDiff = diff;
          bestX = x;
          bestY = y;
        }
      }
    }
  }

  if (maxDiff > 130 && ripples.length === 0) {
    let fx = bestX * pixelSize + pixelSize / 2;
    let fy = bestY * pixelSize + pixelSize / 2;
    ripples.push(new Ripple(fx, fy));
  }

  prevPixels = video.pixels.slice();

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    if (ripples[i].isDead()) ripples.splice(i, 1);
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.life = 255;
    this.alpha = 1;
    this.pop = 1;
  }

  update() {
    this.r += 9;
    this.life *= 0.965;
    this.alpha = map(this.life, 0, 255, 0, 1);
    this.pop *= 0.9;
  }

  isDead() {
    return this.life < 18;
  }
}