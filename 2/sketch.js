function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(245);

  drawPanel(0, 0, drawOne);
  drawPanel(400, 0, drawTwo);
  drawPanel(0, 400, drawThree);
  drawPanel(400, 400, drawFour);

  stroke(255);
  strokeWeight(5);
  line(400, 0, 400, 800);
  line(0, 400, 800, 400);
}

function drawPanel(x, y, drawingFunction) {
  push();
  translate(x, y);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, 400, 400);
  drawingContext.clip();

  scale(0.5);
  drawingFunction();

  drawingContext.restore();
  pop();
}

function panelBG(c) {
  noStroke();
  fill(c);
  rect(0, 0, 800, 800);
}

// 1. 컬러 액체 추상
function drawOne() {
  panelBG("#35424b");
  noStroke();

  fill("#c9c1aa");
  beginShape();
  vertex(0, 255);
  bezierVertex(75, 205, 150, 198, 225, 215);
  bezierVertex(250, 185, 310, 185, 285, 230);
  bezierVertex(340, 205, 375, 232, 345, 270);
  bezierVertex(465, 260, 585, 285, 620, 400);
  bezierVertex(520, 345, 360, 340, 230, 400);
  bezierVertex(120, 450, 60, 505, 0, 530);
  endShape(CLOSE);

  fill("#c9c1aa");
  ellipse(650, 355, 100, 120);
  ellipse(700, 365, 80, 90);
  arc(750, 405, 80, 100, -HALF_PI, HALF_PI);

  fill("#ffd000");
  beginShape();
  vertex(0, 650);
  bezierVertex(100, 620, 190, 620, 300, 650);
  bezierVertex(410, 680, 520, 650, 620, 610);
  bezierVertex(710, 575, 760, 590, 800, 630);
  vertex(800, 800);
  vertex(0, 800);
  endShape(CLOSE);

  fill("#ff0050");
  beginShape();
  vertex(0, 800);
  vertex(0, 590);
  bezierVertex(90, 520, 210, 505, 310, 580);
  bezierVertex(390, 640, 440, 720, 530, 630);
  bezierVertex(610, 550, 690, 535, 760, 590);
  bezierVertex(780, 610, 792, 640, 800, 670);
  vertex(800, 800);
  endShape(CLOSE);

  fill("#ffd1e8");
  beginShape();
  vertex(20, 535);
  bezierVertex(120, 430, 265, 370, 420, 380);
  bezierVertex(560, 390, 610, 455, 540, 520);
  bezierVertex(465, 590, 330, 550, 250, 505);
  bezierVertex(160, 460, 80, 495, 20, 535);
  endShape(CLOSE);

  fill("#b8ddd6");
  beginShape();
  vertex(260, 570);
  bezierVertex(340, 500, 460, 515, 520, 590);
  bezierVertex(575, 660, 510, 710, 410, 685);
  bezierVertex(315, 665, 245, 625, 260, 570);
  endShape(CLOSE);

  fill("#ff0050");
  beginShape();
  vertex(470, 595);
  bezierVertex(515, 545, 570, 560, 555, 610);
  bezierVertex(540, 660, 480, 660, 470, 595);
  endShape(CLOSE);

  stroke("#ffd000");
  strokeWeight(8);
  noFill();
  bezier(240, 470, 330, 410, 470, 405, 535, 500);

  stroke("#ffc5e0");
  strokeWeight(6);
  bezier(0, 420, 180, 310, 405, 325, 570, 430);

  stroke("#c9c1aa");
  strokeWeight(5);
  bezier(0, 250, 70, 210, 80, 245, 100, 220);
  bezier(100, 220, 170, 160, 235, 150, 220, 180);

  noStroke();
}

// 2. 파란 flow line
function drawTwo() {
  panelBG("#2948cc");
  stroke(255);
  strokeWeight(3);
  noFill();

  for (let i = 0; i < 20; i++) {
    beginShape();
    vertex(-40, 100 + i * 7);
    bezierVertex(130, 85 + i, 250, 90 + i * 4, 350, 190);
    bezierVertex(420, 255 + i * 2, 540, 250 + i * 6, 850, 245 + i * 2);
    endShape();
  }

  for (let i = 0; i < 22; i++) {
    beginShape();
    vertex(-30, 420 + i * 13);
    bezierVertex(150, 385 + i * 3, 285, 390 + i * 8, 430, 500 + i * 5);
    bezierVertex(550, 600 + i * 2, 670, 540 + i * 6, 850, 500 + i * 4);
    endShape();
  }

  for (let i = 0; i < 14; i++) {
    beginShape();
    vertex(250 + i * 13, -30);
    bezierVertex(225 + i * 5, 70, 220 + i * 3, 150, 335, 205);
    bezierVertex(430, 250, 430, 280, 380, 310);
    endShape();
  }

  strokeWeight(2.5);
  for (let i = 0; i < 12; i++) {
    beginShape();
    vertex(260 + i * 9, 250);
    bezierVertex(315, 260 + i * 6, 360, 270 + i * 7, 405, 330);
    endShape();
  }
}

// 3. 빨강/검정 페인트 추상
function drawThree() {
  panelBG("#ff2a12");
  noStroke();

  fill("#b9ddff");
  beginShape();
  vertex(170, 0);
  bezierVertex(230, 70, 320, 90, 390, 40);
  bezierVertex(475, -10, 610, 25, 670, 125);
  bezierVertex(540, 165, 410, 150, 300, 115);
  bezierVertex(230, 95, 185, 60, 170, 0);
  endShape(CLOSE);

  fill("#050505");
  beginShape();
  vertex(0, 330);
  bezierVertex(130, 260, 180, 120, 205, 0);
  bezierVertex(250, 190, 385, 270, 540, 315);
  bezierVertex(410, 365, 245, 410, 120, 455);
  vertex(0, 470);
  endShape(CLOSE);

  fill("#b9ddff");
  beginShape();
  vertex(380, 230);
  bezierVertex(490, 155, 660, 175, 800, 235);
  vertex(800, 500);
  bezierVertex(650, 425, 500, 435, 370, 525);
  bezierVertex(425, 410, 420, 310, 380, 230);
  endShape(CLOSE);

  fill("#ff2a12");
  beginShape();
  vertex(550, 170);
  bezierVertex(650, 90, 760, 110, 800, 160);
  vertex(800, 260);
  bezierVertex(700, 210, 620, 210, 550, 270);
  endShape(CLOSE);

  stroke("#ffffff");
  strokeWeight(8);
  noFill();
  bezier(515, 0, 480, 170, 515, 300, 450, 500);
  bezier(625, 120, 500, 230, 565, 400, 700, 600);

  stroke("#050505");
  strokeWeight(6);
  bezier(720, 0, 625, 160, 645, 260, 800, 370);
  bezier(80, 620, 240, 490, 370, 600, 510, 520);
  bezier(250, 55, 370, 95, 490, 70, 560, 35);

  noStroke();
  fill("#050505");
  ellipse(330, 250, 18, 28);
  ellipse(355, 270, 10, 14);
  ellipse(410, 220, 8, 12);
  ellipse(440, 250, 6, 10);
}

// 4. 검정 소용돌이
function drawFour() {
  panelBG(255);
  noStroke();
  fill(0);

  beginShape();
  vertex(0, 155);
  bezierVertex(125, 45, 270, 20, 420, 80);
  bezierVertex(300, 110, 205, 170, 155, 265);
  bezierVertex(85, 245, 35, 205, 0, 155);
  endShape(CLOSE);

  beginShape();
  vertex(155, 265);
  bezierVertex(280, 125, 520, 100, 660, 220);
  bezierVertex(500, 180, 350, 215, 270, 345);
  bezierVertex(220, 335, 185, 305, 155, 265);
  endShape(CLOSE);

  beginShape();
  vertex(270, 345);
  bezierVertex(390, 225, 625, 260, 700, 420);
  bezierVertex(540, 335, 410, 365, 330, 500);
  bezierVertex(290, 460, 270, 400, 270, 345);
  endShape(CLOSE);

  beginShape();
  vertex(330, 500);
  bezierVertex(470, 385, 690, 440, 765, 610);
  bezierVertex(560, 515, 410, 570, 290, 740);
  bezierVertex(300, 630, 310, 560, 330, 500);
  endShape(CLOSE);

  beginShape();
  vertex(0, 620);
  bezierVertex(160, 570, 250, 630, 290, 740);
  bezierVertex(185, 760, 85, 760, 0, 720);
  endShape(CLOSE);

  beginShape();
  vertex(720, 40);
  bezierVertex(805, 80, 820, 180, 750, 250);
  bezierVertex(690, 160, 610, 100, 520, 70);
  endShape(CLOSE);

  beginShape();
  vertex(780, 430);
  bezierVertex(700, 520, 680, 640, 800, 750);
  vertex(800, 430);
  endShape(CLOSE);

  fill(255);
  ellipse(440, 420, 250, 250);
  ellipse(470, 405, 130, 130);
  ellipse(380, 500, 90, 130);

  fill(0);
  beginShape();
  vertex(390, 340);
  bezierVertex(500, 260, 630, 330, 640, 450);
  bezierVertex(560, 380, 480, 365, 410, 430);
  bezierVertex(390, 400, 385, 370, 390, 340);
  endShape(CLOSE);

  fill(255);
  ellipse(470, 420, 120, 120);
}