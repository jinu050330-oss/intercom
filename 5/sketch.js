let w = 50;
let cross = [];
let cols, rows;
let colors = [
  '#FF5F5F',
  '#FF8A5B',
  '#FFD166',
  '#BEE66E',
  '#06D6A0',
  '#35B6B4',
  '#118AB2'
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  cols = ceil(width / w) + 1;
  rows = ceil(height / w) + 1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * w;
      cross.push(new Cross(x, y, w));
    }
  }
}

function draw() {
  background(255);

  for (let i = 0; i < cross.length; i++) {
    cross[i].update();
    cross[i].show();
  }
}

class Cross {
  constructor(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.scl = 1;
    this.col = colors[0];
  }

  show() {
    push();
    translate(this.x, this.y);
    scale(this.scl);

    fill('#ffffff');
    ellipse(this.a / 2, this.a / 2, 3 * this.a);

    fill(this.col);
    ellipse(this.a / 2, this.a / 2, this.a);

    pop();
  }

  update() {
    let distance = dist(this.x + this.a / 2, this.y + this.a / 2, mouseX, mouseY);
    let range = 700;

    this.scl = map(distance, 0,range, 1.5, 0.5);

    if (this.scl < 0.5) {
      this.scl = 0.5;
    }
    if (this.scl > 1.5) {
      this.scl = 1.5;
    }

    let n = map(distance, 0, range, 0, colors.length - 1);

    if (n < 0) {
      n = 0;
    }
    if (n > colors.length - 1) {
      n = colors.length - 1;
    }

    let index = floor(n);
    this.col = colors[index];
  }
}