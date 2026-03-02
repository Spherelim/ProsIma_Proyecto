

const image = "/Public/models/texture/cardMexico.png";

let scene;
let marker;

// const ObtenerElemento = document.getElementById("imagen");

// export function MostrarImagen(){
//     ObtenerElemento.src=image;
// }

function iniciarRA(){
        
    const container = document.getElementById("arContainer");

    // creacion de la escena
    scene = document.createElement("a-scene");
    scene.setAttribute("embedded", "");
    scene.setAttribute("arjs", "sourceType: webcam; debugUIEnabled: false;");

    // creacion del marcador
    marker = document.createElement("a-marker");
    marker.setAttribute("preset", "hiro");
    
    marker.addEventListener("markerFound", () =>{
        //alert("¡Marcador Hiro detectado!");
        
        detenerAR();
        CrearImagen();

    });

    // agregamos el marcador a la escena
    scene.appendChild(marker);

    // Creamos la cámara
    const camera = document.createElement("a-entity");
    camera.setAttribute("camera", "");
    scene.appendChild(camera);

    // agregamos la escena al contenedor
    container.appendChild(scene);

}

function detenerAR(){
    
    // MUERE BASURA!!!

    //alert("¡AR detenido!");

    const videos = document.querySelectorAll("video");
    videos.forEach(video => {
        if (video.id !== "camara") {
            if(video.srcObject){
                video.srcObject.getTracks().forEach(track => track.stop());
            }
            video.remove();
        }
    });

    const scene = document.querySelector("a-scene");
    if (scene) {
        scene.pause();
        if(scene.renderer){
            scene.renderer.dispose();
        }
        scene.remove();
    }

    const canva = document.querySelector("canvas");
    if(canva){
        canva.remove();
    }

    console.log("AR detenido y recursos liberados.");

}

window.addEventListener("DOMContentLoaded", ()=>{
    iniciarRA();
});

// window.addEventListener("DOMContentLoaded", () => {
//     const marker = document.getElementById("hiromarker");

//     marker.addEventListener("markerFound", () => {
//         alert("¡Marcador Hiro detectado!");
        
//         // aqui puedo poner la funcion para agregar la foto con html
//         CrearImagen();


//     });

// });

function CrearImagen(){
    // codigo para hacer la imagen <image></image>

    // const img = document.createElement("img");

    // img.src = image;
    // img.style.width = "200px";
    // img.style.height = "200px";
    // img.style.position = "absolute";
    // img.style.top = "50%";
    // img.style.left = "50%";
    // img.style.transform = "translate(-50%, -50%)";

    // img.id = "imagen";

    // img.addEventListener("click", () =>{
    //     // alert("¡Imagen clickeada!");

    //     // // Eliminar la imagen al hacer click
    //     // img.remove();

    // });

    // document.body.appendChild(img);

    document.getElementById("ItemImg").src = image;

}
