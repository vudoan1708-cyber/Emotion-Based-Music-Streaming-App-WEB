import * as THREE from './node_modules/three/build/three.module.js'
import loadResource from './Hooks/loadResource.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });

const starGeo = new THREE.BufferGeometry();

const sprite = new THREE.TextureLoader().load( './assets/star.png' );

const colour = new THREE.Color(-1, 0, 1);
const numStars = 12000;

function init() {

    camera.position.z = 1;
    camera.rotation.x = Math.PI/2;
    
    //setup renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // loadResource(starGeo, renderer, scene, camera);

    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < numStars; i++) {

        // positions
        const x = Math.random() * 700 - 300;
        const y = Math.random() * 700 - 300;
        const z = Math.random() * 700 - 300;
        
        positions.push(x, y, z);
        // if (i < numStars / 3) {

        // colors
        const vx = Math.random() * 1;
        const vy = Math.random() * 1;
        const vz = Math.random() * 1;

        color.setRGB(vx, vy, vz);
        colors.push(color.r, color.g, color.b);
        // }
    }

    makeStars(colors, positions);
    animate();
}

//rendering loop
function animate() {
    renderer.render(scene, camera);
    // starGeo.vertices.forEach(p => {
    //     p.velocity += p.acceleration
    //     p.y -= p.velocity;
        
    //     if (p.y < -200) {
    //       p.y = 200;
    //       p.velocity = 0;
    //     }
    //   });
    // starGeo.verticesNeedUpdate = true; 
    requestAnimationFrame(animate);
}

function makeStars(colors, positions) {
    
    starGeo.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    starGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    console.log(starGeo)
    // console.log(starGeo)
    let starMaterial = new THREE.PointsMaterial({
        size: 0.7,
        map: sprite,
        vertexColors: true,
        transparent: true,
    });

    // for(let i = 0; i < numStars; i++) {
    //     let star = new THREE.Vector3(
    //         Math.random() * 700 - 300,
    //         Math.random() * 700 - 300,
    //         Math.random() * 700 - 300
    //     );
    //     star.velocity = 0;
    //     star.acceleration = 0.02;
        
    //     starGeo.vertices.push(star);
    // }
    const stars = new THREE.Points(starGeo, starMaterial);
    // console.log(stars)
    scene.add(stars);
    renderer.render(scene, camera);
}

init();