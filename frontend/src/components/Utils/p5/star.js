export default function star(x, y, radius1, radius2, npoints, p5) {
  const angle = p5.TWO_PI / npoints;
  const halfAngle = angle / 2.0;

  p5.beginShape();
  for (let a = 0; a < p5.TWO_PI; a += angle) {
    let sx = x + p5.cos(a) * radius2;
    let sy = y + p5.sin(a) * radius2;
    p5.vertex(sx, sy);
    sx = x + p5.cos(a + halfAngle) * radius1;
    sy = y + p5.sin(a + halfAngle) * radius1;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
}
