let t = 0;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
}

function draw() {
  background("#e9f0e8");

  t += 0.01;

  drawSoftBlobs();
  drawRedTexture();
  drawPatterns();
  drawYellowLines();
  drawNoiseOverlay();
}

function drawSoftBlobs() {
  noStroke();

  fill(255, 180, 190, 120);
  ellipse(400, 390, 620, 560);

  fill(255, 150, 175, 70);
  ellipse(260, 520, 420, 430);

  fill(120, 220, 205, 80);
  rect(630, 0, 170, 800);

  fill(20, 70, 70, 150);
  triangle(670, 0, 800, 0, 760, 230);

  fill(20, 70, 60, 150);
  triangle(0, 0, 110, 0, 70, 180);

  fill(0, 80, 255, 150);
  ellipse(20, 780, 220, 220);
}

function drawRedTexture() {
  noStroke();

  fill(255, 0, 0, 140);
  beginShape();
  vertex(310, 80);
  vertex(450, 45);
  vertex(520, 220);
  vertex(470, 390);
  vertex(340, 390);
  vertex(280, 230);
  endShape(CLOSE);

  fill(255, 0, 0, 120);
  beginShape();
  vertex(120, 80);
  vertex(210, 230);
  vertex(270, 440);
  vertex(220, 650);
  vertex(110, 540);
  vertex(80, 290);
  endShape(CLOSE);

  for (let i = 0; i < 7000; i++) {
    let x = random(width);
    let y = random(height);
    let n = noise(x * 0.01, y * 0.01, t);

    if (n > 0.52) {
      fill(255, 0, 0, random(20, 80));
      circle(x, y, random(1, 2.4));
    }
  }
}

function drawPatterns() {
  strokeWeight(4);
  stroke(255, 0, 0, 210);

  for (let x = 95; x < width; x += 205) {
    line(x, 0, x, 190);
    line(x + 10, 40, x + 10, 90);
    line(x + 10, 120, x + 10, 170);
  }

  strokeWeight(2);
  for (let x = 30; x < width; x += 70) {
    for (let y = 30; y < height; y += 70) {
      let wobble = noise(x * 0.01, y * 0.01, t) * 10;
      stroke(255, 0, 0, 150);
      line(x + wobble, y, x + 12 + wobble, y + 12);
      line(x + 34 - wobble, y + 12, x + 48 - wobble, y);
    }
  }

  noStroke();
  for (let y = 80; y < height; y += 78) {
    fill(255, 0, 0, 230);
    circle(20, y, 26);
    circle(220, y, 26);

    fill(255, 150, 160, 180);
    circle(780, y, 26);
  }
}

function drawYellowLines() {
  stroke("#eeff00");
  strokeWeight(16);
  strokeCap(SQUARE);
  strokeJoin(MITER);

  let w = sin(t * 3) * 4;

  line(-20, 800, 230 + w, 560);
  line(230 + w, 560, 155, 320);
  line(230 + w, 560, 350, 370);
  line(230 + w, 560, 640, 190);
  line(230 + w, 560, 800, 700);
}

function drawNoiseOverlay() {
  loadPixels();

  for (let i = 0; i < pixels.length; i += 4) {
    let grain = random(-22, 22);
    pixels[i] += grain;
    pixels[i + 1] += grain;
    pixels[i + 2] += grain;
  }

  updatePixels();

  noFill();
  stroke(255, 255, 255, 35);
  strokeWeight(1);

  for (let x = 0; x < width; x += 80) {
    line(x + noise(x, t) * 10, 0, x, height);
  }

  for (let y = 0; y < height; y += 80) {
    line(0, y + noise(y, t) * 10, width, y);
  }
}