let img;
let tilewidth = 60;
let tiles = [];
let activeTiles = [];
let disappearing = false;

function preload() {
  img = loadImage('image.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  img.resize(width, height);

  let offsetX = width / 2 - img.width / 2;
  let offsetY = height / 2 - img.height / 2;

  for (let x = 0; x < img.width; x += tilewidth) {
    for (let y = 0; y < img.height; y += tilewidth) {
      let tileImg = img.get(x, y, tilewidth, tilewidth);

      let tx = x + offsetX + tilewidth / 2;
      let ty = y + offsetY + tilewidth / 2;

      tiles.push({
        img: tileImg,
        x: width / 2,
        y: height / 2,
        targetX: tx,
        targetY: ty,
        baseX: tx,
        baseY: ty,
        alpha: 0,

        scale: random(0.3, 2),
        size: 0,

        phase: random(TWO_PI),
        floatAmp: random(3,20),
        floatSpeed: random(0.01, 0.035)
      });
    }
  }

  background('#EFD9BF');
}

function draw() {
  background('#EFD9BF');

  if (!disappearing && tiles.length > 0) {
    let index = floor(random(tiles.length));
    activeTiles.push(tiles[index]);
    tiles.splice(index, 1);
  }

  for (let i = activeTiles.length - 1; i >= 0; i--) {
    let t = activeTiles[i];

    let floatX = sin(frameCount * t.floatSpeed + t.phase) * t.floatAmp;
    let floatY = cos(frameCount * t.floatSpeed + t.phase) * t.floatAmp;

    if (!disappearing) {
      t.targetX = t.baseX + floatX;
      t.targetY = t.baseY + floatY;
    }

    t.x = lerp(t.x, t.targetX, 0.08);
    t.y = lerp(t.y, t.targetY, 0.08);

    // 크기 애니메이션
    t.size = lerp(t.size, t.scale, 0.08);

    let w = tilewidth * t.size;
    let h = tilewidth * t.size;

    if (disappearing) {
      t.alpha -= 8;
    } else {
      t.alpha += 6;
    }

    t.alpha = constrain(t.alpha, 0, 255);

    tint(255, t.alpha);
    image(t.img, t.x, t.y, w, h);
    noTint();

    if (disappearing && t.alpha <= 0) {
      activeTiles.splice(i, 1);
    }
  }
}

function mousePressed() {
  disappearing = true;

  for (let t of activeTiles) {
    t.targetX = width / 2;
    t.targetY = height / 2;
  }
}