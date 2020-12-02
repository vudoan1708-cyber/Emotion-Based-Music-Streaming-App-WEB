<template>
  <div id="three_container"></div>
</template>

<script>
import { Scene } from 'three/src/scenes/Scene';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Geometry } from 'three/src/core/Geometry';
// import { DirectionalLight } from 'three/src/lights/DirectionalLight';
// import { AmbientLight } from 'three/src/lights/AmbientLight';
// // import { PlaneBufferGeometry } from 'three/src/geometries/PlaneBufferGeometry';
// // import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
// // import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
// // import { Mesh } from 'three/src/objects/Mesh';

// // import { TextureLoader } from 'three/src/loaders/TextureLoader';
// // import { BackSide } from 'three/src/constants';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// import { Vector2 } from 'three/src/math/Vector2';

import { onMounted } from 'vue';

// Reusable Components
import loadResource from '@/components/Hooks/loadResource';

export default {
  name: 'StarryBackground',
  setup() {
    /* eslint-disable no-console */
    /* eslint-disable padded-blocks */
    /* eslint-disable no-trailing-spaces */
    /* eslint-disable no-multiple-empty-lines */
    /* eslint-disable semi */
    /* eslint-disable indent */
    /* eslint-disable no-unused-vars */
    /* eslint-disable max-len */
    /* eslint-disable no-param-reassign */

    // three.js
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    const starGeo = new Geometry();
    let renderer;

    // const colour = new Color(-1, 0, 1);

    // rendering loop
    function animate() {
      renderer.render(scene, camera);
        starGeo.vertices.forEach((p) => {
            p.velocity += p.acceleration
            p.y -= p.velocity;
            
            if (p.y < -200) {
              p.y = 200;
              p.velocity = 0;
            }
          });
        starGeo.verticesNeedUpdate = true; 
      requestAnimationFrame(animate);
    }

    function init() {

      // DOM elements
      const container = document.getElementById('three_container');
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);

      // setup renderer
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor('#000000', 1);

      renderer.setPixelRatio(window.devicePixelRatio);

      // set size of the renderer to be full screen
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.position.z = 1;
      camera.rotation.x = Math.PI / 2;

      // setup renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      loadResource(starGeo, renderer, scene, camera);
    // makeStars();
      // animate();
    }

    // function makeStars() {
    //   const sprite = new THREE.TextureLoader().load('./assets/star.png');
    //   const starGeo = new THREE.Geometry();
    //   const starMaterial = new THREE.PointsMaterial({
    //     color: 0xaaaaaa,
    //     size: 0.7,
    //     map: sprite,
    //   });

    //   for (let i = 0; i < numStars; i++) {
    //     const star = new THREE.Vector3(
    //       Math.random() * 700 - 300,
    //       Math.random() * 700 - 300,
    //       Math.random() * 700 - 300,
    //     );
    //     starGeo.vertices.push(star);
    //   }
    //   const stars = new THREE.Points(starGeo, starMaterial);
    //   scene.add(stars);
    //   renderer.render(scene, camera);
    // }

    onMounted(() => {
      init();
    });
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_bg';
</style>
