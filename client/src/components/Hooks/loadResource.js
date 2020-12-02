import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Points } from 'three/src/objects/Points';
import { PointsMaterial } from 'three/src/materials/PointsMaterial';

export default function loadResource(starGeo, renderer, scene, camera) {
  /* eslint-disable no-console */
  /* eslint-disable padded-blocks */
  /* eslint-disable no-trailing-spaces */
  /* eslint-disable no-multiple-empty-lines */
  /* eslint-disable semi */
  /* eslint-disable indent */
  /* eslint-disable no-unused-vars */
  /* eslint-disable max-len */

  const numStars = 3000;

  const loader = new TextureLoader();

  const URL = './assets/star.png';

  let starMaterial;

  // load material
  loader.load(

    // path to the image texture
    URL,

    // async callback after the img is loaded
    (texture) => {

      // create a point material
      starMaterial = new PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: texture,
        transparent: true,
      });

      console.log(starMaterial);

      // loop through the number of stars
      for (let i = 0; i < numStars; i += 1) {

        // create a 3d vector
        const star = new Vector3(
          Math.random() * 700 - 300,
          Math.random() * 700 - 300,
          Math.random() * 700 - 300,
        );

        // append these 3d vectors to the unknown geometry as its vertices
        starGeo.vertices.push(star);

        // set initial values to each vertex's velocity and acceleration
        star.velocity = 0;
        star.acceleration = 0.02;
      }

      // make a points mesh from the geometry and the material
      const stars = new Points(starGeo, starMaterial);
      scene.add(stars);
      renderer.render(scene, camera);
    },
  );
}
