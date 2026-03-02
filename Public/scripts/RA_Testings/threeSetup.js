import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
const container = document.querySelector(".phone-camera");
const infoPanel = document.querySelector("#coords-info");

//importacion de models.js
import {cargarModelo, ScaleModel} from './models.js';
import { crearLuces } from './luces.js';

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
    cargarModelo('/Public/models/chaparroObj.obj',
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
const btn1 = document.getElementById("A-1");
const btn2 = document.getElementById("A-2");
const btn3 = document.getElementById("A-3");


let clock = new THREE.Clock();


ItemImg.addEventListener("click", () =>{
    //alert("¡Imagen clickeada!");

    btn1.src = "/Public/image/Acciones/button1.png";
    btn2.src = "/Public/image/Acciones/button2.png";
    btn3.src = "/Public/image/Acciones/button3.png";
    // Eliminar la imagen al hacer click
    ItemImg.remove();

    // para poder ver el modelo 3D
    CrearProyeccion3D();

    InitModel();
    crearLuces(scene);
    animate();

});

btn1.addEventListener("click", () =>{
    //alert("¡Botón 1 clickeado!");
    scene.remove(ChibiModel);
    Actions(1);
});

btn2.addEventListener("click", () =>{
    //alert("¡Botón 2 clickeado!");
    scene.remove(ChibiModel);
    Actions(2);
});

btn3.addEventListener("click", () =>{
    //alert("¡Botón 3 clickeado!");
    scene.remove(ChibiModel);
    Actions(3);
});

function Actions(number){

    switch (number) {
        case 1:
            ChibiModel = '/Public/models/Animations/macarenaGLB.glb';
            break;
        case 2:
            ChibiModel = '/Public/models/Animations/hiphopGLB.glb';
            break;
        case 3:
            ChibiModel = '/Public/models/Animations/soccerGLB.glb';
            break;
        default:
            console.error('Acción no reconocida:', number);
    }

    cargarModelo(ChibiModel,
        scene,
        (modelo,mixer) =>{
            ChibiModel = modelo;
            console.log('Modelo Cargado',modelo);
            if(mixer) mixers.push(mixer);            
        }
    );
}


// 🔄 Animación
function animate(){
    requestAnimationFrame(animate);
    controls.update();

    ScaleModel(ChibiModel,5.0);

    if(infoPanel){
        infoPanel.innerHTML = `
            <b>Camera Position:</b> (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})<br>
        `
    }

    const delta = clock.getDelta();
    mixers.forEach((m)=> m.update(delta));

    if(ChibiModel){

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