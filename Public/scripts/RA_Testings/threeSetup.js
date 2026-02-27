import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const container = document.querySelector(".phone-camera");
const infoPanel = document.querySelector("#coords-info");

// Escena
const scene = new THREE.Scene();

// Cámara 3D
const camera = new THREE.PerspectiveCamera(
    70, // más cercas o más lejos
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

// 🧊 Cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

container.addEventListener("wheel", (event) => {
    event.preventDefault();
    const scaleAmount = event.deltaY * -0.001;

    cube.scale.x = Math.max(0.1, cube.scale.x + scaleAmount);
    cube.scale.y = Math.max(0.1, cube.scale.y + scaleAmount);
    cube.scale.z = Math.max(0.1, cube.scale.z + scaleAmount);

},{passive: false});

// 🔄 Animación
function animate(){
    requestAnimationFrame(animate);

    controls.update();

    if(infoPanel){
        infoPanel.innerHTML = `
            <b>Camera Position:</b> (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})<br>
            <b>cubo escala:</b> ${cube.scale.x.toFixed(2)}
        `

    }

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// 🔁 Resize responsive
window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});