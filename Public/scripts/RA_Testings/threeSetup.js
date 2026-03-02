import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const container = document.querySelector(".phone-camera");
const infoPanel = document.querySelector("#coords-info");

//importacion de models.js
import {cargarModelo, ScaleModel} from './models.js';

// Escena
let scene = null;  

// Cámara 3D
let camera = null;

// Renderer
let renderer = null;

// Controles de órbita
let controls = null;

function CrearProyeccion3D(){
    // Creamos la escena
    scene = new THREE.Scene();

    // camara
    camera = new THREE.PerspectiveCamera(
    70, // más cercas o más lejos
    container.clientWidth / container.clientHeight,
    0.1,
    1000
    );

    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
}

// 🧊 Cubo
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshNormalMaterial();
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// aqui termina el cubo

let ChibiModel = null;
let mixers = [];

function InitModel(){
    cargarModelo('/Public/models/chaparroFBX.fbx',
        scene,
        (modelo,mixer) =>{
            ChibiModel = modelo;
            console.log('Modelo Cargado',modelo);

            if(mixer) mixers.push(mixer);
            
        }
    );
}

container.addEventListener("wheel", (event) => {
    event.preventDefault();
    // const scaleAmount = event.deltaY * -0.001;

    // cube.scale.x = Math.max(0.1, cube.scale.x + scaleAmount);
    // cube.scale.y = Math.max(0.1, cube.scale.y + scaleAmount);
    // cube.scale.z = Math.max(0.1, cube.scale.z + scaleAmount);

},{passive: false});

// Cargar el modelo
//InitModel();

const ItemImg = document.getElementById("ItemImg");
ItemImg.addEventListener("click", () =>{
    alert("¡Imagen clickeada!");

    // Eliminar la imagen al hacer click
    ItemImg.remove();

    CrearProyeccion3D();
    InitModel();
    animate();

    
});


// 🔄 Animación
function animate(){
    requestAnimationFrame(animate);
    controls.update();

    ScaleModel(ChibiModel,0.01);

    if(infoPanel){
        infoPanel.innerHTML = `
            <b>Camera Position:</b> (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})<br>
        `
    }

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

//animate();

// 🔁 Resize responsive
// window.addEventListener("resize", () => {
//     camera.aspect = container.clientWidth / container.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(container.clientWidth, container.clientHeight);
// });