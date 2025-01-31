import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

// scene,camera, render
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Klein Bottle func
function kleinBottle(u, v, target) {
    u = u * Math.PI * 2; // Масштабування параметра u
    v = v * Math.PI * 2; // Масштабування параметра v

    let x, y, z;

    // Радіус трубки з додатковим масштабуванням для збільшення дна
    const r = 4 * (1 - Math.cos(u) / 2) * (1 + 0.2 * Math.sin(u)); // Додаємо масштабування через sin(u)

    // Змінюємо формулу для більшого дна
    x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(v);
    y = r * Math.sin(v);
    z = -16 * Math.sin(u) * (1 + 0.2 * Math.cos(u)); // Додаємо масштабування через cos(u)

    // Встановлення результату
    target.set(x, y, z);
}




// creating geometry
const geometry = new ParametricGeometry(kleinBottle, 80, 40);
const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide});
const kleinMesh = new THREE.Mesh(geometry, material);
scene.add(kleinMesh);

// camera positon
camera.position.z = 20;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);
    kleinMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();