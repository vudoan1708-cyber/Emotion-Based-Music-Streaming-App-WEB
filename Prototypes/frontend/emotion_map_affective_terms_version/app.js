const width = window.innerWidth,
      height = window.innerHeight;

let hex = [];

function drawLinePaths() {
  push();
    stroke(255);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < 360; i += 50) {            
      
      hex[i].show();
    }
    endShape(CLOSE);
  pop();
}

function drawAffectiveTermMaps() {

}

function setup() {
  createCanvas(width, height);
  const x1 = width / 2,
        y1 = height / 2;

  for (let i = 0; i < 360; i += 50) {
    const r = 250;
    const x2 = r * cos(i),
          y2 = r * sin(i);
          
    
    hex[i] = new Hex(x1, y1, x1 + x2, y1 + y2);
    // vertex(x2, y2)
  }
  console.log(hex);
}

function draw() {
  background(20);
  drawLinePaths();
}