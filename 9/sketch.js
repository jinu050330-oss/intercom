let inputStr = "";
let particles = [];

let bgColor = "#000000";
let forming = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  createBackgroundLines();
}

function draw() {
  background(bgColor);

  for (let p of particles) {
    p.update();
    p.show();
  }

  drawInput();
}
//최종이 가로 정렬일필요없어 가운데에 랜덤하게 잇어도 돼 근데 좀 모여서 수직수평은 이뤗으면 조헧어 //그리고 애초에 얇은 선들이 랜덥하게 등장해서 그게 뒤에서 앞으로 오면서 결국에 글자모양을 만들엇으면 좋겟느거야

function createBackgroundLines() {
  particles = [];

  for (let i = 0; i < 1600; i++) {
    particles.push(new LineParticle(random(width), random(height)));
  }
}

function createTextParticles(str) {
  forming = true;

  let size = min(230, width / max(str.length * 0.58, 1));
  let gap = 7;

  let targets = [];

  let pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0);
  pg.fill(255);
  pg.noStroke();
  pg.textAlign(CENTER, CENTER);
  pg.textStyle(BOLD);
  pg.textSize(size);
  pg.text(str, width / 2, height * 0.5);
  pg.loadPixels();

  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      let index = 4 * (x + y * width);
      let bright = pg.pixels[index];

      if (bright > 10 && random() < 0.82) {
        targets.push({
          x: x + random(-2, 2),
          y: y + random(-2, 2)
        });
      }
    }
  }

  shuffle(targets, true);

  for (let i = 0; i < particles.length; i++) {
    if (i < targets.length) {
      particles[i].setTarget(targets[i].x, targets[i].y);
    } else {
      particles[i].stayBackground();
    }
  }
}

function drawInput() {
  fill(255, 160);
  noStroke();
  textSize(26);
  text(inputStr, width / 2, height - 70);

  stroke(255, 80);
  strokeWeight(1);
  line(width / 2 - 180, height - 45, width / 2 + 180, height - 45);
}

function keyTyped() {
  if (key !== "Enter" && key !== "Backspace") {
    inputStr += key;
  }
}

function keyPressed() {
  if (keyCode === ENTER && inputStr.length > 0) {
    createTextParticles(inputStr.toUpperCase());
    inputStr = "";
  }

  if (keyCode === BACKSPACE) {
    inputStr = inputStr.substring(0, inputStr.length - 1);
  }
}

class LineParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.homeX = x;
    this.homeY = y;

    this.tx = x;
    this.ty = y;

    this.angle = random(TWO_PI);
    this.targetAngle = random(TWO_PI);

    this.len = random(8, 28);
    this.weight = random(0.6, 1.5);

    this.isText = false;

    this.speed = random(0.025, 0.06);
    this.delay = random(0, 80);

    this.noiseSeedX = random(1000);
    this.noiseSeedY = random(1000);
  }

  setTarget(tx, ty) {
    this.tx = tx;
    this.ty = ty;

    this.isText = true;
    this.delay = random(0, 100);
    this.speed = random(0.025, 0.055);

    if (random() < 0.5) {
      this.targetAngle = 0;
    } else {
      this.targetAngle = HALF_PI;
    }
  }

  stayBackground() {
    this.isText = false;
    this.tx = this.homeX;
    this.ty = this.homeY;
    this.targetAngle = random(TWO_PI);
  }

  update() {
    if (this.isText) {
      if (this.delay > 0) {
        this.delay--;
        this.floatAround();
        return;
      }

      this.x = lerp(this.x, this.tx, this.speed);
      this.y = lerp(this.y, this.ty, this.speed);
      this.angle = lerp(this.angle, this.targetAngle, 0.08);
    } else {
      this.floatAround();
    }
  }

  floatAround() {
    this.x += sin(frameCount * 0.01 + this.noiseSeedX) * 0.35;
    this.y += cos(frameCount * 0.012 + this.noiseSeedY) * 0.35;
    this.angle += 0.003;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    if (this.isText && this.delay <= 0) {
      stroke(255, 0, 0, 230);
      strokeWeight(this.weight + 0.3);
    } else {
      stroke(255, 120);
      strokeWeight(this.weight);
    }

    line(-this.len / 2, 0, this.len / 2, 0);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createBackgroundLines();
}