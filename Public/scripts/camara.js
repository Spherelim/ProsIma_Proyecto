const video = document.getElementById("camara");
const Mobile =
navigator.userAgentData?.mobile ??
/Android|WebOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


async function startCamera(){
    try{
        const stream = await navigator.mediaDevices.getUserMedia({
            video:{
                width: {ideal:360},
                height: {ideal:640},
                facingMode: Mobile ? "environment" : "user"
            },
            audio: false
        });

        video.srcObject = stream;

    } catch (error){
        console.error("Error acessing the camera: ", error);
        alert("Unable to access the camera. Plase check your permissions and try again.");
    }

}

startCamera();

// let stream = false;

// function abrirCamara() {
//     navigator.mediaDevices.getUserMedia({ video: true })
//     .then(function (s) {
//         stream = s;
//         document.getElementById('camara').srcObject = stream;
//     })
//     .catch(function (error) {
//         console.log("Error al abrir la cámara: ", error);
//     });
// }

// function cerrarCamara() {
//     if (stream) {
//         // Detiene todas las pistas de video
//         stream.getTracks().forEach(track => track.stop());
//         document.getElementById('camara').srcObject = null;
//     }
// }



const filtros = document.querySelectorAll('.opcFiltro');
const overlay = document.getElementById('overlay');

filtros.forEach((filtro, index) => {
  filtro.addEventListener('click', () => {
    switch(index) {
      case 0: video.style.filter = 'none'; break;
      case 1: video.style.filter = 'grayscale(1)'; break;
      case 2: video.style.filter = 'sepia(1)'; break;
      case 3: video.style.filter = 'contrast(1.5) brightness(1.2)'; break;
    }
  });
});
