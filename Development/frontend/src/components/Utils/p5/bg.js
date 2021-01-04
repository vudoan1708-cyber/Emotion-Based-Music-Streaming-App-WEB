/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import GalaxyStars from '@/components/Utils/p5/classes/galaxy';

export function createBGStars(width, height, stars, galaxy, p) {
  let r; let g; let b;

  for (let i = 0; i < stars.length; i += 1) {
    const a = p.random(45, 100);

    if (i < stars.length / 4) {
      r = p.random(200, 255);
      g = p.random(200, 255);
      b = 0;
    } else if (i >= stars.length / 4 && i < stars.length / 2) {
      r = p.random(200, 255);
      g = p.random(20, 40);
      b = p.random(20, 40);
    } else if (i >= stars.length / 2 && i < stars.length / 1.5) {
      r = p.random(20, 40);
      g = p.random(200, 255);
      b = p.random(20, 40);
    } else {
      r = p.random(20, 40);
      g = p.random(20, 40);
      b = p.random(200, 255);
    }

    galaxy[i] = new GalaxyStars(p.random(width), p.random(height), p.random(1.0, 1.5), p.random(1.5, 2.5), p.color(r, g, b, a), p.random(255));
  }
}

export function drawGalaxyBG(galaxy, p) {
  for (let i = 0; i < galaxy.length; i += 1) {
    galaxy[i].show(p);
  }
}

export function moveGalaxyBG(galaxy, mouseX, width) {
  for (let i = 0; i < galaxy.length; i += 1) {
    galaxy[i].move(mouseX, width);
  }
}
