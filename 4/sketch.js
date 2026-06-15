let fCols = ["#5B5FEF","#7A8CFF","#4D6CFA","#8E6BFF","#A78BFA","#5ECFFF","#2D2F5A"];

let bCols = ["#FF9F68","#FFD166","#FF7A90","#F4A261","#E9ECEF"];

let t=0;

let wd = 50;
let cols, rows;

let setColor;  
let bgColor;    

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = ceil(width / (wd + 50)) + 1;
  rows = ceil(height / (wd + 50)) + 1;
  noLoop();
  changeColors();
  background(bgColor);
  drawpatterns();
}

function changeColors() {
  bgColor = random(fCols);
  setColor = random(bCols);
}

function drawpatterns() {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * (wd + 50);
      let y = row * (wd + 50);
      drawellipse(x, y, wd);
    }
  }
}

function drawellipse(x, y, w) {
  let r = random(1);
  let o;
  for(o=0;o<=15;o++){

  if (r < 0.9) {
    
    noFill();
    stroke(setColor);
    strokeWeight(1);
    ellipse(x, y, w);

  } else {
    fill(setColor);
    noStroke();
    ellipse(x , y , w);
    fill(bgColor);
    stroke(setColor);
    strokeWeight(1);
    ellipse(x-o, y-o, w);
  }}
}

function draw() {
 
}

function mousePressed() {
  changeColors();
  background(bgColor);
  drawpatterns();
}
function windowResized(){
  resizeCanvas(windowWidth,windowHeight);

 cols = ceil(width / (wd + 50)) + 1;
  rows = ceil(height / (wd + 50)) + 1;
}