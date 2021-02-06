/* eslint-disable brace-style */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable operator-linebreak */
/* eslint-disable no-trailing-spaces */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-cycle
import { updatePlaylist } from '@/handlers/spotify';

export default class SongDots {
  constructor(label, title, id, valence, arousal,
              album_imgs, artist_details, artist_names, external_urls,
              x, y, size, p5) {
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

    this.p5 = p5;
  }

  onHover() {
    if (this.p5.mouseX > this.x - this.size / 2 && this.p5.mouseX < this.x + this.size / 2) {
      if (this.p5.mouseY > this.y - this.size / 2 && this.p5.mouseY < this.y + this.size / 2) {
        return true;
      }
    } return false;
  }

  show() {
    // responses
    let updatedSize = this.size;
    if (this.onHover()) updatedSize += 5;
    else updatedSize = this.size;

    this.p5.push();

    // effects
    this.p5.noStroke();
    this.p5.fill(200, 75);
    this.p5.ellipse(this.x, this.y, updatedSize + 5);

    this.p5.stroke(0);
    // if accepted by the system: green, by user: yellow, not accepted: gray, by user personalised playlist: red
    if (this.label === 'accepted') { this.p5.fill(0, 225, 0); }
    else if (this.label === 'accepted_by_user') { this.p5.fill(255, 255, 0); }
    else if (this.label === 'user_playlist') { this.p5.fill(255, 0, 0, 200); }
    else this.p5.fill(150);
    this.p5.ellipse(this.x, this.y, updatedSize);

    // effects
    this.p5.fill(200, 75);
    this.p5.ellipse(this.x, this.y, updatedSize - 5);
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
