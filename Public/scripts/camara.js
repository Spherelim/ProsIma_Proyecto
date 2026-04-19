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


// Hola liz, porfis pon comentarios para saber que ase cada cosa ;D
// Yo tambien pondre comentarios desde el día de hoy, 22/03/2026
const filtros = document.querySelectorAll('.opcFiltro');
const overlay = document.getElementById('overlay');

// De donde agarra el "grayscale" y lo demas?

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


const btnFoto = document.getElementById('btnFoto');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const preview = document.getElementById('preview');

btnFoto.addEventListener('click', () => {
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.filter = video.style.filter;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (overlay.src) {
        context.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    }

    const dataURL = canvas.toDataURL('image/png');

    preview.src = dataURL;

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'foto.png';
    link.click();

});
