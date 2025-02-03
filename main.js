import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';


// textures/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w.jpg
// scene,camera, render
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// postprosesing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.2, 0.1);
composer.addPass(bloomPass);


// textures (./textures/LISENS.txt)
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./textures/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w.jpg', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});


// Klein Bottle func
function kleinBottle(u, v, target) {
    u = u * Math.PI * 2;
    v = v * Math.PI * 2;

    let x, y, z;

    const r = 4 * (1 - Math.cos(u) / 2) * (1 + 0.2 * Math.sin(u));

    x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(v);
    y = r * Math.sin(v);
    z = -16 * Math.sin(u) * (1 + 0.2 * Math.cos(u));

    target.set(x, y, z);
}




// creating geometry of Klein Bottle
const geometry = new ParametricGeometry(kleinBottle, 80, 40);
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.97,
    thickness: 1.0,
    opacity: 1,
    roughness: 0.01,
    metalness: 0.1,
    ior: 1.52,
    clearcoat: 1,
    clearcoatRoughness: 0,
    reflectivity: 0.1,
    side: THREE.DoubleSide
});

const kleinMesh = new THREE.Mesh(geometry, material);
scene.add(kleinMesh);

// creating geometry of balls
const numBalls = 5;
const spheres = [];
const colors = [0x00A3FF, 0x8D33FF, 0xA1FF13, 0xFF338D, 0xFF9030];


for (let i = 0; i < numBalls; i++) {
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 10,
        roughness: 0.3,
        metalness: 0.8
    });


    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    spheres.push({ sphere, tOffset: i * 0.3 });

    const light = new THREE.PointLight(colors[i], 100, 50);
    sphere.add(light);
}




//light & shadows
const light1 = new THREE.PointLight(0xffffff, 10, 100);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 5, 100);
light2.position.set(-10, -10, 10);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);


// camera options & positon
camera.position.z = 25;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const sceneGroup = new THREE.Group();
scene.add(sceneGroup);

// positons
sceneGroup.add(kleinMesh);
spheres.forEach(({ sphere }) => sceneGroup.add(sphere));
sceneGroup.rotation.x = -(Math.PI / 2);
sceneGroup.add(light1);
sceneGroup.add(light2);

// animation and rendering
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    composer.render();
}

let t = 0;
function animateBalls() {
    t += 0.002;

    spheres.forEach(({ sphere, tOffset }) => {
        let tValue = (t + tOffset) % 1;

        const u = tValue * Math.PI * 2;
        const v = (Math.sin(tValue * 2) * 0.5 + 0.5) * Math.PI * 2;

        let x = 6 * Math.cos(u) * (1 + Math.sin(u));
        let y = 4 * (1 - Math.cos(u) / 2) * Math.sin(v);
        let z = -16 * Math.sin(u) * (1 + 0.2 * Math.abs(Math.sin(u)));

        sphere.position.set(x, y, z);
    });

    requestAnimationFrame(animateBalls);
}

animateBalls();
animate();