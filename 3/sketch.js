let rad1 = 0, rad2 = 0;
let a = 500, b = 500;

let g = 0.7;
let m = 50, n = 50;
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  a = mouseX;
  b = mouseY;
}
function draw() {
  background('#390099');
  noStroke();

  let x, y;

  g += 0.01
  if (g > 1) {
    g = 0.7
  }

  for (let x = 0; x < width + 100; x += 100) {
    for (let y = onabort; y < height + 100; y += 100) {

      push();
      translate(x, y);
      rotate(rad2);
      fill('#CF0057');
      rect(31, 10, 51, 122);
      pop();
    }
  }

  for (let x = 0; x < width + 180; x += 150) {
    for (let y = onabort; y < height + 180; y += 150) {

      push();
      translate(x, y);
      rotate(rad1);
      fill('#FFBD00');
      beginShape();
      vertex(5.3, 2.78);
      vertex(5.3, 103.28);
      vertex(115.3, 165.28);
      vertex(205.8, 38.78);

   

      endShape();
      pop();
    }
  }




  rad1 += PI / 360;
  rad2 -= PI / 360;





  fill("#FF0054");
  ellipse(a, b, 100);



}