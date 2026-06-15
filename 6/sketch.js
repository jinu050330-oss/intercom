let vines = [];
let d = 80;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(235, 210, 170);
}

function draw() {
  background(235, 210, 170,30);

  for (let i = vines.length - 1; i >= 0; i--) {
    let c = vines[i];

    if (c.isdone() || c.opacity <= 0) {
      vines.splice(i, 1);
    } else {
      c.update();
      c.display();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < d; i++) {
    vines.push(new Vine(mouseX, mouseY, i));
  }
}

class Vine {
  constructor(x, y, n) {
    this.cx = x;
    this.cy = y;
//나이테같이 원이 게속 이동하면서 그 잔상이 ellipse를 만드는거야 근데 거기서 중심은 같ㅌ지만 좀 쭈글쭈글한 원을 만들기 위해서 뭐를 넣어야할까?
//이렇게 돌아가는 형태를 p5.js에서 구현하고ㅛㅣㅍ응데 여러 원이 이동하면서 비정형적인 형태지만 저렇게 동심원으로 나타낫으면 좋겟어
//각각 변수가 뭘 의미하는지 알려줘

    this.angle = map(n, 0, d, 0, TWO_PI);
    this.maxR = random(60, 220);
    this.r = random(10, this.maxR);

    this.x = this.cx + cos(this.angle) * this.r;
    this.y = this.cy + sin(this.angle) * this.r;

    this.pX = this.x;
    this.pY = this.y;

    this.speed = random(0.01, 0.04);

    this.plus = random(-16, 16);
    this.a = random(-0.04,0.04);

    this.opacity = 255;
  }

  display() {
    noFill();
    stroke(55, 30, 20, this.opacity);
    strokeWeight(1.5);
    line(this.x, this.y, this.pX, this.pY);
  }

  update() {
    this.pX = this.x;
    this.pY = this.y;

    this.angle += this.speed;

   
    this.plus += this.a;

    if (this.plus > 20 || this.plus < -20) {
      this.a *= -1;
    }

    // 근데 사라질때는 좀 퍼지면서 사라지면 좋겟어
    this.r += random(0.1, 0.8);

    let rr = this.r + this.plus;

    this.x = this.cx + cos(this.angle) * rr;
    this.y = this.cy + sin(this.angle) * rr;

    this.opacity -= 1;
  }

  isdone() {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      return true;
    } else {
      return false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(235, 210, 170);
}
