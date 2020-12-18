import { PointsMaterial } from '../node_modules/three/src/materials/PointsMaterial.js';
import { TextureLoader } from '../node_modules/three/src/loaders/TextureLoader.js';
import { Points } from '../node_modules/three/src/objects/Points.js';
import { Vector3 } from '../node_modules/three/src/math/Vector3.js';

export default function loadResource(starGeo, renderer, scene, camera) {

    const numStars = 3000;

    const loader = new TextureLoader();

    let starMaterial;

    loader.load( '../assets/star.png', (texture) => {
        starMaterial = new PointsMaterial({
            color: 0xaaaaaa,
            size: 0.7,
            map: texture,
            transparent: true
        });
        console.log(starMaterial)
        for(let i = 0; i < numStars; i++) {
            let star = new Vector3(
                Math.random() * 700 - 300,
                Math.random() * 700 - 300,
                Math.random() * 700 - 300
            );
            star.velocity = 0;
            star.acceleration = 0.02;
            
            starGeo.vertices.push(star);
        }
        const stars = new Points(starGeo, starMaterial);
        scene.add(stars);
        renderer.render(scene, camera);
    } );
}