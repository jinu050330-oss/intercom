const MODEL_URL = "https://teachablemachine.withgoogle.com/models/5AtHma3l2/";

let model;
let video;

let rawLabel = "loading...";
let confidence = 0;
let ready = false;

const MOVE_LEFT = "left";
const MOVE_RIGHT = "오른쪽";
const MOVE_CENTER = "가운데";

let gameState = "start";
let score = 0;
let lives = 5;

let punchSide = "left";
let punchX = 0;
let punchSpeed = 2.0;

let message = "모델 로딩 중...";
let actionText = "";
let locked = false;
let shake = 0;

function setup() {
  createCanvas(640, 520);

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  loadTM();
}

async function loadTM() {
  await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js");

  if (typeof tmImage === "undefined") {
    rawLabel = "tmImage 로딩 실패";
    message = "라이브러리 로딩 실패";
    console.error("tmImage is undefined");
    return;
  }

  model = await tmImage.load(
    MODEL_URL + "model.json",
    MODEL_URL + "metadata.json"
  );

  ready = true;
  message = "SPACE로 시작";
  predictLoop();
}

async function predictLoop() {
  if (!ready) return;

  const predictions = await model.predict(video.elt);
  predictions.sort((a, b) => b.probability - a.probability);

  rawLabel = predictions[0].className;
  confidence = predictions[0].probability;

  setTimeout(predictLoop, 100);
}

function draw() {
  background(18);

  if (shake > 0) {
    translate(random(-6, 6), random(-6, 6));
    shake--;
  }

  drawRules();
  drawGameBox();
  drawPlayer();
  drawPunch();
  drawCamera();
  drawUI();

  if (gameState === "play" && !locked) {
    movePunch();
  }

  if (!ready) {
    drawCenter("모델 로딩 중...");
  }

  if (ready && gameState === "start") {
    drawCenter("PUNCH DODGE\nSPACE 시작");
  }

  if (gameState === "gameover") {
    drawCenter("GAME OVER\nScore: " + score + "\nR 재시작");
  }
}

function drawRules() {
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("규칙", 20, 25);
  text("1. 주먹이 날아오면 반대 방향으로 피하기", 20, 45);
  text("2. 피하면 점수 +1", 20, 65);
  text("3. 맞으면 목숨 -1", 20, 85);
}

function drawGameBox() {
  fill(35);
  rect(20, 105, 600, 250, 20);
}

function drawPlayer() {
  let x = 320;

  if (rawLabel === MOVE_LEFT) {
    x = 220;
  }

  if (rawLabel === MOVE_RIGHT) {
    x = 420;
  }

  if (rawLabel === MOVE_CENTER) {
    x = 320;
  }

  fill(245, 200, 160);
  ellipse(x, 225, 80, 80);

  fill(0);
  ellipse(x - 15, 215, 7, 7);
  ellipse(x + 15, 215, 7, 7);

  fill(255);
  textSize(16);
  textAlign(CENTER);
  text("YOU", x, 285);
}

function drawPunch() {
  if (gameState === "start" || gameState === "gameover") return;

  fill(230, 60, 60);
  ellipse(punchX, 225, 70, 50);

  if (punchSide === "left") {
    rect(punchX - 95, 210, 95, 30);
  } else {
    rect(punchX, 210, 95, 30);
  }
}

function movePunch() {
  if (punchSide === "left") {
    punchX += punchSpeed;

    if (punchX >= 320) {
      judgeDodge();
    }
  } else {
    punchX -= punchSpeed;

    if (punchX <= 320) {
      judgeDodge();
    }
  }
}

function judgeDodge() {
  if (punchSide === "left" && rawLabel === MOVE_RIGHT) {
    success();
    return;
  }

  if (punchSide === "right" && rawLabel === MOVE_LEFT) {
    success();
    return;
  }

  fail();
}

function success() {
  if (locked) return;

  locked = true;
  score++;
  message = "회피 성공! 점수 +1";

  setTimeout(newRound, 600);
}

function fail() {
  if (locked) return;

  locked = true;
  lives--;
  shake = 12;
  message = "맞았다! 목숨 -1";

  if (lives <= 0) {
    gameState = "gameover";
  } else {
    setTimeout(newRound, 800);
  }
}

function newRound() {
  locked = false;

  punchSide = random(["left", "right"]);

  if (punchSide === "left") {
    punchX = 60;
    message = "오른쪽으로 피해!";
    actionText = "해야 할 행동: 오른쪽";
  } else {
    punchX = 580;
    message = "왼쪽으로 피해!";
    actionText = "해야 할 행동: left";
  }

  gameState = "play";
}

function drawCamera() {
  push();
  translate(20 + 320 * 0.38, 370);
  scale(-0.38, 0.38);
  image(video, 0, 0, 320, 240);
  pop();

  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("현재 모델 인식: " + rawLabel, 155, 405);
  text("정확도: " + nf(confidence * 100, 0, 1) + "%", 155, 425);
}

function drawUI() {
  fill(255);
  textSize(18);

  textAlign(RIGHT);
  text("Score: " + score, width - 20, 30);
  text("Lives: " + lives, width - 20, 55);
  text("Speed: " + nf(punchSpeed, 0, 1), width - 20, 80);

  textAlign(CENTER);
  text(message, width / 2, 380);

  fill(255, 230, 80);
  textSize(22);
  text(actionText, width / 2, 470);

  fill(120, 220, 255);
  textSize(18);
  text("인식: " + rawLabel, width / 2, 495);
}

function drawCenter(t) {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(t, width / 2, height / 2);
}

function keyPressed() {
  if (!ready) return;

  if (key === " ") {
    score = 0;
    lives = 5;
    punchSpeed = 2.0;
    newRound();
  }

  if (key === "r" || key === "R") {
    score = 0;
    lives = 5;
    punchSpeed = 2.0;
    newRound();
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    let oldScript = document.querySelector('script[src="' + src + '"]');

    if (oldScript) {
      resolve();
      return;
    }

    let script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}