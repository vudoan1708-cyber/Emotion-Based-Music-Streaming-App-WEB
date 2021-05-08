/* eslint-disable brace-style */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable padded-blocks */
/* eslint-disable operator-linebreak */
/* eslint-disable no-trailing-spaces */
/* eslint-disable consistent-return */
import star from '@/components/Utils/p5/star';
// eslint-disable-next-line import/no-cycle
import { updatePlaylist } from '@/handlers/spotify';
import mapRegions from '@/components/Utils/p5/mapRegions';

export default class SongDots {
  constructor(label, title, id, valence, arousal,
              album_imgs, artist_details, artist_names, external_urls,
              x, y, size, width, height, p5) {
    this.label = label;
    this.title = title;
    this.id = id;
    this.valence = valence;
    this.arousal = arousal;
    this.album_imgs = album_imgs;
    this.artist_details = artist_details;
    this.artist_names = artist_names;
    this.external_urls = external_urls;
    this.x = x;
    this.y = y;
    this.size = size;

    this.region = mapRegions(this.x, this.y, width, height);
    
    // this.scaleFactor = 1;
    this.p5 = p5;
  }

  onHover() {
    // * by 3 is because in the show() method
    // the variable updatedSize * by 3
    if (this.p5.mouseX > this.x - (this.size * 3) / 2
      && this.p5.mouseX < this.x + (this.size * 3) / 2) {
      if (this.p5.mouseY > this.y - (this.size * 3) / 2
        && this.p5.mouseY < this.y + (this.size * 3) / 2) {
        return true;
      }
    } return false;
  }

  zoom(zoomFactor, mx, my) {
    // this.p5.push();
    this.size += zoomFactor;

    // Calculate the distance between the mouse coordinates and each song dot's coordinates
    const d = this.p5.dist(mx, my, this.x, this.y) / 20;

    // Check for the sign of the zoomFactor argument
    // if it is positive, which means, zooming in (for now)
    if (Math.sign(zoomFactor) === 1) {
      if (this.x < mx) {
        this.x -= d;
      } else if (this.x > mx) this.x += d;
  
      if (this.y < my) {
        this.y -= d;
      } else if (this.y > mx) this.y += d;
    
    // otherwise, if it is negative, which means, zooming out
    } else {
      if (this.x < mx) {
        this.x += d;
      } else if (this.x > mx) this.x -= d;
  
      if (this.y < my) {
        this.y += d;
      } else if (this.y > mx) this.y -= d;
    }
    // console.log(this.x, this.y);
    
    // this.zoomX += this.p5.mouseX;
    // this.zoomY += this.p5.mouseY;
  }

  show() {
    // responses
    let updatedSize = this.size;
    if (this.onHover()) updatedSize += 5;
    else updatedSize = this.size;

    this.p5.push();
    this.p5.translate(this.x, this.y);
    // this.p5.scale(this.scaleFactor);
    // effects
    this.p5.noStroke();
    this.p5.fill(200, 75);
    // this.p5.ellipse(this.x, this.y, updatedSize + 5);
    star(0, 0, updatedSize * 3, updatedSize / 3, 4, this.p5);

    this.p5.stroke(0);
    // if accepted by the system: green,
    // by user: yellow, not accepted: gray,
    // by user personalised playlist: red
    if (this.label === 'accepted') { this.p5.fill(225, 225, 225); }
    else if (this.label === 'accepted_by_user') { this.p5.fill(255, 255, 0); }
    else if (this.label === 'user_playlist') { this.p5.fill(50, 50, 50, 200); }
    else {
      // eslint-disable-next-line no-lonely-if
      if (this.region === 1) { this.p5.fill(200, 20, 0, 150); }
      else if (this.region === 2) { this.p5.fill(20, 200, 0, 150); }
      else if (this.region === 3) { this.p5.fill(20, 20, 200, 150); }
      else if (this.region === 4) { this.p5.fill(122, 45, 245, 150); }
      // this.p5.fill(150);
    }
    // this.p5.ellipse(this.x, this.y, updatedSize);
    star(0, 0, updatedSize * 1.5, updatedSize / 1.5, 4, this.p5);

    // effects
    // this.p5.fill(200, 75);
    // this.p5.ellipse(this.x, this.y, updatedSize - 5);
    this.p5.pop();
  }

  overlaidPos(song) {
    if (this.x === song.x && this.y === song.y) {
      return true;
    } return false;
  }

  updateLabels(starDots, chosenPoints, emitter) {
    const bounds = starDots[chosenPoints[0]][chosenPoints[1]].showBoundaries();

    // re-compare
    if (this.x > bounds.x1 && 
      this.x < bounds.x2
  && this.y > bounds.y1 && 
      this.y < bounds.y2) {

      if (this.label === 'unaccepted' || this.label === 'accepted_by_user' || this.label === 'user_playlist') {

        // change the label to affect the visualisation
        this.label = 'accepted';

        // push it in the playlist array
        updatePlaylist(this, 'add', emitter);
      }

    } else {

      // eslint-disable-next-line no-lonely-if
      if (this.label === 'accepted') {

        // change the label to affect the visualisation
        this.label = 'unaccepted';

        updatePlaylist(this, 'remove', emitter);
      }
    }
  }
}
