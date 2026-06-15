let faceMesh;
let video;
let faces = [];

let player;
let people = [];
let followers = [];

let lives = 3;
let maxLives = 3;
let score = 0;
let spawnTimer = 0;

let blinkCount = 0;
let blinkLock = false;
let currentTarget = null;

let gameState = "main";

function preload() {
  faceMesh = ml5.faceMesh({
    maxFaces: 1,
    refineLandmarks: true,
    flipped: true
  });
}

function setup() {
  createCanvas(900, 500);

  video = createCapture(VIDEO, { flipped: true });
  video.size(320, 240);
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  resetGame();
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  if (gameState === "main") {
    drawMainScreen();
    return;
  }

  if (gameState === "over") {
    drawClassroomBackground();
    drawTopUI();
    drawGameOver();
    return;
  }

  drawClassroomBackground();
  drawTopUI();

  handleFaceInput();

  updatePlayer();
  drawHeroGirl(player.x, player.y);

  spawnPeople();
  updatePeople();
  updateFollowers();

  drawCameraPreview();
}

function keyPressed() {
  if (key === " ") {
    if (gameState === "main" || gameState === "over") {
      resetGame();
      gameState = "play";
    }
  }
}

function resetGame() {
  player = {
    x: 130,
    y: 395,
    vy: 0,
    onGround: true
  };

  people = [];
  followers = [];

  lives = 3;
  score = 0;
  spawnTimer = 0;

  blinkCount = 0;
  blinkLock = false;
  currentTarget = null;
}

function drawMainScreen() {
  drawClassroomBackground();
  drawHeartBackground();

  fill(20, 105, 32);
  stroke(255);
  strokeWeight(4);
  rect(width / 2 - 260, 150, 520, 120, 8);

  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(64);
  text("눈빛꼬시기", width / 2, 225);

  fill(255, 230, 250);
  textSize(22);
  text("Press SPACE", width / 2, 320);
}

function drawClassroomBackground() {
  background(238, 238, 210);

  noStroke();

  fill(242, 238, 220);
  rect(0, 0, width, height);

  fill(230, 228, 210);
  rect(0, 345, width, 155);

  fill(220, 235, 230, 90);
  for (let y = 360; y < height; y += 18) {
    rect(0, y, width, 1);
  }

  drawClassroomWall();

  fill(120, 120, 110, 35);
  ellipse(160, 430, 85, 18);
}

function drawClassroomWall() {
  for (let i = 0; i < 6; i++) {
    let x = i * 180 - 30;

    fill(145, 115, 78);
    rect(x + 10, 120, 8, 225);
    rect(x + 168, 120, 8, 225);

    fill(247, 238, 224);
    rect(x + 18, 128, 150, 210);

    fill(255, 225, 250, 135);
    rect(x + 32, 155, 54, 55);
    rect(x + 100, 155, 54, 55);

    fill(255, 238, 250, 90);
    rect(x + 30, 218, 128, 95);

    stroke(255, 255, 255, 150);
    strokeWeight(3);
    line(x + 43, 198, x + 70, 162);
    line(x + 112, 198, x + 145, 162);

    noStroke();
  }

  fill(130, 105, 75);
  rect(0, 116, width, 8);
  rect(0, 342, width, 8);

  fill(95, 95, 78);
  rect(0, 350, width, 7);
}

function drawTopUI() {
  drawChalkBoard(12, 28, 380, 90);
  drawChalkBoard(width - 392, 28, 380, 90);
  drawClock(width / 2, 73, 38);

  noStroke();
  fill(255);
  textAlign(LEFT);
  textSize(17);
  text("LOVE 게이지", 28, 57);

  for (let i = 0; i < maxLives; i++) {
    if (i < lives) {
      drawHeartShape(35 + i * 34, 84, 13, color(255, 150, 220));
    } else {
      noFill();
      stroke(255, 210, 240);
      strokeWeight(3);
      drawHeartOutline(35 + i * 34, 84, 13);
      noStroke();
    }
  }

  fill(255);
  textAlign(LEFT);
  textSize(18);
  text("스코어", width - 365, 57);

  textSize(38);
  text(nf(score, 8), width - 365, 100);

  drawSoundIcon(width - 75, 72);
  drawMiniBook(360, 108);
  drawMiniBook(width - 140, 108);

  if (currentTarget) {
    let girlInvolved = isGirlInvolved();
    let requiredBlink = girlInvolved ? 2 : 1;
    drawBlinkGauge(width / 2 - 100, 112, 200, 18, blinkCount / requiredBlink);

    fill(255);
    textAlign(CENTER);
    textSize(14);
    text("Blink " + blinkCount + " / " + requiredBlink, width / 2, 106);
  }
}

function drawChalkBoard(x, y, w, h) {
  push();

  fill(10, 95, 22);
  stroke(230);
  strokeWeight(3);
  rect(x, y, w, h, 2);

  noStroke();
  fill(255, 255, 255, 25);
  for (let i = 0; i < w; i += 6) {
    rect(x + i, y + 4, 1, h - 8);
  }

  pop();
}

function drawClock(x, y, r) {
  push();

  fill(255);
  stroke(140, 90, 100);
  strokeWeight(4);
  circle(x, y, r * 2);

  stroke(120);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let a = -HALF_PI + TWO_PI * i / 12;
    line(
      x + cos(a) * (r - 7),
      y + sin(a) * (r - 7),
      x + cos(a) * (r - 2),
      y + sin(a) * (r - 2)
    );
  }

  stroke(180, 35, 55);
  strokeWeight(4);
  line(x, y, x + 4, y - 24);

  stroke(90);
  strokeWeight(3);
  line(x, y, x - 14, y + 3);

  noStroke();
  fill(180, 35, 55);
  circle(x, y, 7);

  pop();
}

function drawSoundIcon(x, y) {
  push();

  stroke(255);
  strokeWeight(4);
  noFill();
  rect(x - 30, y - 25, 62, 55, 12);

  noStroke();
  fill(255);
  rect(x - 17, y - 4, 10, 18);
  triangle(x - 7, y - 8, x + 8, y - 18, x + 8, y + 22);

  noFill();
  stroke(255);
  strokeWeight(3);
  arc(x + 14, y + 2, 18, 28, -PI / 3, PI / 3);
  arc(x + 20, y + 2, 30, 42, -PI / 3, PI / 3);

  pop();
}

function drawMiniBook(x, y) {
  push();

  translate(x, y);
  rotate(0.25);

  fill(170, 50, 45);
  rect(-14, -6, 28, 12, 2);

  fill(230, 200, 80);
  rect(-8, -8, 16, 16, 2);

  fill(60);
  rect(8, -6, 6, 12);

  pop();
}

function drawHeartBackground() {
  push();

  for (let i = 0; i < 45; i++) {
    let x = (i * 97) % width;
    let y = (i * 53) % height;
    let s = 8 + (i % 5) * 5;

    drawHeartShape(x, y, s, color(255, 80, 140, 35));
  }

  pop();
}

function handleFaceInput() {
  if (faces.length === 0) return;

  let face = faces[0];
  let blinking = isBlinking(face);
  let lookingUp = isLookingUp(face);

  if (lookingUp && player.onGround) {
    player.vy = -15;
    player.onGround = false;
  }

  if (currentTarget && blinking && !blinkLock) {
    blinkCount++;

    for (let p of people) {
      if (p.type === "girl" && !p.dead && abs(p.x - currentTarget.x) < 170) {
        p.involved = true;
        p.speed = 0;
      }
    }

    blinkLock = true;
  }

  if (!blinking) {
    blinkLock = false;
  }
}

function isBlinking(face) {
  let k = face.keypoints;

  let leftTop = k[159];
  let leftBottom = k[145];
  let leftLeft = k[33];
  let leftRight = k[133];

  let rightTop = k[386];
  let rightBottom = k[374];
  let rightLeft = k[362];
  let rightRight = k[263];

  if (!leftTop || !rightTop) return false;

  let leftEAR =
    dist(leftTop.x, leftTop.y, leftBottom.x, leftBottom.y) /
    dist(leftLeft.x, leftLeft.y, leftRight.x, leftRight.y);

  let rightEAR =
    dist(rightTop.x, rightTop.y, rightBottom.x, rightBottom.y) /
    dist(rightLeft.x, rightLeft.y, rightRight.x, rightRight.y);

  return (leftEAR + rightEAR) / 2 < 0.22;
}

function isLookingUp(face) {
  let k = face.keypoints;

  let forehead = k[10];
  let chin = k[152];
  let nose = k[1];

  if (!forehead || !chin || !nose) return false;

  let faceHeight = dist(forehead.x, forehead.y, chin.x, chin.y);
  let noseRatio = (nose.y - forehead.y) / faceHeight;

  return noseRatio < 0.43;
}

function updatePlayer() {
  player.y += player.vy;
  player.vy += 0.8;

  if (player.y >= 395) {
    player.y = 395;
    player.vy = 0;
    player.onGround = true;
  }
}

function spawnPeople() {
  spawnTimer++;

  if (spawnTimer > 80 && people.length < 3) {
    let r = random();
    let type;

    if (r < 0.45) type = "boy";
    else if (r < 0.75) type = "girl";
    else type = "teacher";

    let s = random(2.2, 3.8);

    people.push({
      type: type,
      x: width + 60,
      y: 395,
      speed: s,
      baseSpeed: s,
      involved: false,
      dead: false
    });

    spawnTimer = 0;
  }
}

function updatePeople() {
  currentTarget = null;

  for (let i = people.length - 1; i >= 0; i--) {
    let p = people[i];

    if (!p.dead) {
      p.x -= p.speed;
    }

    if (p.type === "boy") {
      drawBoy(p.x, p.y);

      if (p.x > player.x && p.x - player.x < 230) {
        currentTarget = p;
      }

      if (p.x < player.x - 30) {
        failCharm(p);
      }
    }

    if (p.type === "girl") {
      if (p.dead) {
        drawDeadPerson(p.x, p.y);
      } else if (p.involved) {
        drawGirl(p.x, p.y, true);
      } else {
        drawGirl(p.x, p.y, false);
      }
    }

    if (p.type === "teacher") {
      drawTeacher(p.x, p.y);

      if (collide(player, p)) {
        lives--;
        people.splice(i, 1);

        if (lives <= 0) {
          gameState = "over";
        }
        continue;
      }
    }

    if (p.x < -100) {
      people.splice(i, 1);
    }
  }

  handleCharming();
}

function handleCharming() {
  if (!currentTarget) {
    blinkCount = 0;
    return;
  }

  let requiredBlink = isGirlInvolved() ? 2 : 1;

  if (blinkCount >= requiredBlink) {
    charmBoy(currentTarget);
  }
}

function isGirlInvolved() {
  for (let p of people) {
    if (p.type === "girl" && p.involved && !p.dead) {
      return true;
    }
  }
  return false;
}

function charmBoy(boy) {
  score += 100;

  followers.push({
    x: player.x - 45 - followers.length * 32,
    y: player.y
  });

  for (let p of people) {
    if (p.type === "girl" && p.involved && !p.dead) {
      p.involved = false;
      p.speed = p.baseSpeed;
    }
  }

  let index = people.indexOf(boy);
  if (index !== -1) {
    people.splice(index, 1);
  }

  blinkCount = 0;
  currentTarget = null;
}

function failCharm(boy) {
  for (let p of people) {
    if (p.type === "girl" && p.involved && !p.dead) {
      p.dead = true;
      p.speed = 0;
      p.y = 420;
    }
  }

  let index = people.indexOf(boy);
  if (index !== -1) {
    people.splice(index, 1);
  }

  blinkCount = 0;
  currentTarget = null;
}

function drawBlinkGauge(x, y, w, h, ratio) {
  ratio = constrain(ratio, 0, 1);

  push();

  noStroke();
  fill(255, 210, 235);
  rect(x, y, w, h, 10);

  fill(255, 60, 210);
  rect(x, y, w * ratio, h, 10);

  noFill();
  stroke(255);
  strokeWeight(2);
  rect(x, y, w, h, 10);

  pop();
}

function updateFollowers() {
  for (let i = 0; i < followers.length; i++) {
    let f = followers[i];

    let targetX = player.x - 45 - i * 32;
    let targetY = player.y;

    f.x = lerp(f.x, targetX, 0.08);
    f.y = lerp(f.y, targetY, 0.08);

    drawCharmedBoy(f.x, f.y);
  }
}

function drawHeroGirl(x, y) {
  push();

  fill(40, 35, 120, 60);
  ellipse(x, y + 28, 65, 14);

  strokeWeight(3);
  stroke(35, 35, 45);

  fill(255);
  rect(x - 12, y - 75, 24, 42, 8);

  fill(35, 70, 180);
  triangle(x - 18, y - 35, x + 18, y - 35, x, y - 5);

  stroke(255);
  line(x - 10, y - 38, x - 22, y - 20);
  line(x + 10, y - 38, x + 22, y - 20);

  stroke(255, 220, 170);
  line(x - 8, y - 5, x - 12, y + 25);
  line(x + 8, y - 5, x + 12, y + 25);

  stroke(40, 60, 180);
  line(x - 12, y + 25, x - 24, y + 25);
  line(x + 12, y + 25, x + 24, y + 25);

  noStroke();
  fill(255, 220, 170);
  circle(x, y - 90, 30);

  fill(90, 25, 25);
  arc(x, y - 91, 38, 42, PI, TWO_PI);
  rect(x - 19, y - 90, 12, 40);
  rect(x + 7, y - 90, 12, 40);

  fill(0);
  circle(x - 5, y - 92, 3);
  circle(x + 5, y - 92, 3);

  pop();
}

function drawBoy(x, y) {
  push();

  fill(40, 40, 70, 50);
  ellipse(x, y + 28, 55, 12);

  stroke(40, 120, 255);
  strokeWeight(5);
  fill(40, 120, 255);

  circle(x, y - 58, 26);
  line(x, y - 45, x, y - 12);
  line(x, y - 32, x - 18, y - 15);
  line(x, y - 32, x + 18, y - 15);
  line(x, y - 12, x - 15, y + 25);
  line(x, y - 12, x + 15, y + 25);

  pop();
}

function drawCharmedBoy(x, y) {
  push();

  fill(40, 40, 70, 50);
  ellipse(x, y + 28, 55, 12);

  stroke(120, 220, 255);
  strokeWeight(5);
  fill(120, 220, 255);

  circle(x, y - 58, 26);
  line(x, y - 45, x, y - 12);
  line(x, y - 32, x - 18, y - 15);
  line(x, y - 32, x + 18, y - 15);
  line(x, y - 12, x - 15, y + 25);
  line(x, y - 12, x + 15, y + 25);

  noStroke();
  drawHeartShape(x - 6, y - 61, 4, color(255, 50, 140));
  drawHeartShape(x + 6, y - 61, 4, color(255, 50, 140));

  pop();
}

function drawGirl(x, y, involved) {
  push();

  fill(40, 40, 70, 50);
  ellipse(x, y + 28, 55, 12);

  let c = involved ? color(255, 165, 220) : color(255, 90, 180);

  stroke(c);
  strokeWeight(5);
  fill(c);

  circle(x, y - 58, 26);
  line(x, y - 45, x, y - 12);
  line(x, y - 32, x - 18, y - 15);
  line(x, y - 32, x + 18, y - 15);
  line(x, y - 12, x - 15, y + 25);
  line(x, y - 12, x + 15, y + 25);

  if (involved) {
    noStroke();
    drawHeartShape(x, y - 90, 15, color(255, 40, 220));
  }

  pop();
}

function drawTeacher(x, y) {
  push();

  fill(40, 40, 70, 50);
  ellipse(x, y + 28, 60, 12);

  stroke(255, 50, 50);
  strokeWeight(5);
  fill(255, 50, 50);

  circle(x, y - 60, 28);
  line(x, y - 45, x, y - 10);
  line(x, y - 32, x - 22, y - 15);
  line(x, y - 32, x + 22, y - 15);
  line(x, y - 10, x - 18, y + 25);
  line(x, y - 10, x + 18, y + 25);

  noStroke();
  fill(0);
  rect(x - 10, y - 66, 20, 4);

  pop();
}

function drawDeadPerson(x, y) {
  push();

  stroke(115);
  strokeWeight(5);
  fill(115);

  circle(x - 35, y - 10, 22);
  line(x - 23, y - 10, x + 35, y - 10);
  line(x - 5, y - 10, x - 25, y - 30);
  line(x - 5, y - 10, x - 25, y + 10);
  line(x + 25, y - 10, x + 45, y - 30);
  line(x + 25, y - 10, x + 45, y + 10);

  noStroke();
  fill(80);
  textAlign(CENTER);
  textSize(12);
  text("DEAD", x, y + 30);

  pop();
}

function drawHeartShape(x, y, s, c) {
  push();

  fill(c);
  noStroke();

  beginShape();
  vertex(x, y);
  bezierVertex(x - s, y - s, x - s * 1.5, y + s / 2, x, y + s);
  bezierVertex(x + s * 1.5, y + s / 2, x + s, y - s, x, y);
  endShape(CLOSE);

  pop();
}

function drawHeartOutline(x, y, s) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - s, y - s, x - s * 1.5, y + s / 2, x, y + s);
  bezierVertex(x + s * 1.5, y + s / 2, x + s, y - s, x, y);
  endShape(CLOSE);
}

function collide(a, b) {
  return abs(a.x - b.x) < 35 && abs(a.y - b.y) < 70;
}

function drawCameraPreview() {
  push();

  translate(width - 175, height - 112);
  image(video, 0, 0, 160, 105);

  noFill();
  stroke(255);
  strokeWeight(2);
  rect(0, 0, 160, 105);

  pop();
}

function drawGameOver() {
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);

  fill(255, 80, 140);
  textAlign(CENTER);
  textSize(56);
  text("GAME OVER", width / 2, height / 2);

  fill(255);
  textSize(24);
  text("Final Score: " + score, width / 2, height / 2 + 50);

  fill(120, 220, 255);
  textSize(20);
  text("Press SPACE to Restart", width / 2, height / 2 + 95);
}