const width = window.innerWidth,
      height = window.innerHeight;

let imgPixels = [];

let img = null;

function make2dArray(cols, rows) {
  const arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function preload() {
  const PATH = './img/album.jpg';
  img = loadImage(PATH);
}

function setup() {
  createCanvas(width, height);
  rectMode(CENTER);
  pixelDensity(1);
  image(img, 0, 0, width, height);

  // make 2d array
  imgPixels = make2dArray(width, height);

  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = x + y * width * 4;
      const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];
      // console.log(r, g, b);
      imgPixels[x][y] = new ImgPixels(x, y, 5, r, g, b);
    }
  }
  updatePixels();
}

function draw() {
  background(51);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      imgPixels[x][y].show();
    }
  }
}