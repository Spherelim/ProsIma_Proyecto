import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.querySelector(".phone-camera");

// Escena
const scene = new THREE.Scene();

// Cámara 3D
const camera = new THREE.PerspectiveCamera(
    70, // más cercas o más lejos
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

// 🧊 Cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 🔄 Animación
function animate(){
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// 🔁 Resize responsive
window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});