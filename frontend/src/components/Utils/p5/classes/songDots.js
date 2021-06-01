/* eslint-disable brace-style */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable padded-blocks */
/* eslint-disable consistent-return */
import star from '@/components/Utils/p5/star';
// eslint-disable-next-line import/no-cycle
import { updatePlaylist } from '@/handlers/spotify';
import mapRegions from '@/components/Utils/p5/mapRegions';

import { coordinatesToIndices, zoom } from '@/components/Utils/logic/algorithm';

export default class SongDots {
  constructor(label, title, id, valence, arousal,
              album_imgs, artist_details, artist_names, external_urls,
              x, y, size, width, height, p5,
              zoomVal, panningVal) {
    this.label = label;
    this.title = title;
    this.id = id;
    this.valence = valence;
    this.arousal = arousal;
    this.album_imgs = album_imgs;
    this.artist_details = artist_details;
    this.artist_names = artist_names;
    this.external_urls = external_urls;

    this.prevX = x;
    this.prevY = y;
    this.x = x;
    this.y = y;

    this.size = size;
    this.oldSize = this.size;

    this.p5 = p5;
    if (zoomVal !== 0 || panningVal.x !== 0 || panningVal.y !== 0) {
      this.zoom(zoomVal);
      this.panning(panningVal.x, panningVal.y);
    }

    this.region = mapRegions(this.prevX, this.prevY, width, height);
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

  findSongOriginalIndices(w, h) {
    const { i, j } = coordinatesToIndices(this.prevX, this.prevY, w, h);
    const songIndexI = i;
    const songIndexJ = j;
    return { songIndexI, songIndexJ };
  }

  reset(which) {
    if (which === undefined) {
      this.x = this.prevX;
      this.y = this.prevY;
      this.size = this.oldSize;
    } else if (which === 'positions') {
      this.x = this.prevX;
      this.y = this.prevY;
    } else if (which === 'size') {
      this.size = this.oldSize;
    }
  }

  panning(x, y) {
    // if (this.x > window.innerWidth / 2 + 20 || this.x < window.innerWidth / 2 - 20) {
    //   if (this.y > window.innerHeight / 2 + 20 || this.y < window.innerHeight / 2 - 20) {
    this.x += x;
    this.y += y;
    //   } else this.reset();
    // } else this.reset();
  }

  zoom(zoomFactor, zoomVal) {
    if (zoomFactor !== 0 && zoomVal !== 0) {
      // this.p5.push();
      this.size += zoomFactor / 10;

      const roi = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      const OFFSET_ZOOM = zoom(zoomFactor, roi, this.x, this.y, this.p5, false);

      this.x += OFFSET_ZOOM.x;
      this.y += OFFSET_ZOOM.y;
    } else if (zoomVal === 0) {
      this.reset();
    }
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
    // if accepted by the system: white,
    // by user: yellow,
    // by user personalised playlist: grey
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

  updateLabels(starDots, chosenPoints) {
    const bounds = starDots[chosenPoints[0]][chosenPoints[1]].showBoundaries();

    // re-compare
    if (this.x > bounds.x1
        && this.x < bounds.x2
    && this.y > bounds.y1
        && this.y < bounds.y2) {

      if (this.label === 'unaccepted' || this.label === 'accepted_by_user' || this.label === 'user_playlist') {

        // change the label to affect the visualisation
        this.label = 'accepted';

        // push it in the playlist array
        updatePlaylist(this, 'add');
      }

    } else {

      // eslint-disable-next-line no-lonely-if
      if (this.label === 'accepted') {

        // change the label to affect the visualisation
        this.label = 'unaccepted';

        updatePlaylist(this, 'remove');
      }
    }
  }
}
