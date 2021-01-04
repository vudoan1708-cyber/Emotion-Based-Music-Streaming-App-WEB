class SongDots {
  constructor(label, id, x, y, size) {
    this.label = label;
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show() {
    push();

      // effects
      noStroke();
      fill(200, 75);
      ellipse(this.x, this.y, this.size + 5);

      stroke(0);
      if (this.label === 'accepted')
        fill(0, 225, 0);
      else fill(150);
      ellipse(this.x, this.y, this.size);

      // effects
      fill(200, 75);
      ellipse(this.x, this.y, this.size - 5);
    pop();
  }

  onHover(isSongLoading) {
    if (isSongLoading) {
      if (mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2) {
        if (mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2) {
          return true;
        } 
      } return false;
    }
  }

  updateLabels() {

    const bounds = starDots[chosenPoints[0]][chosenPoints[1]].showBoundaries();

    // re-compare
    if (this.x > bounds.x1 && 
        this.x < bounds.x2
    && this.y > bounds.y1 && 
        this.y < bounds.y2) {

        if (this.label === 'unaccepted') {

          // change the label to affect the visualisation
          this.label = 'accepted';

          // push it in the playlist array
          playlist.push(this.id);
        }
        
      } else {

        if (this.label === 'accepted') {

          // change the label to affect the visualisation
          this.label = 'unaccepted';

          // splice it off the playlist array
          playlist.forEach((track, i) => {
            if (track === this.id)
              playlist.splice(i, 1);
          });
        }
      }
  }
}