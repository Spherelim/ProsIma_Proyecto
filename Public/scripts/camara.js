const video = document.getElementById("camara");

// Función para detectar el tipo de dispositivo
function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Detectar tablet por tamaño de pantalla y user agent
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent) || 
                    (window.innerWidth >= 768 && window.innerWidth <= 1024 && 
                     /Android|iPad/i.test(userAgent));
    
    // Detectar móvil
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) 
                    && !isTablet;
    
    return { isMobile, isTablet };
}

async function startCamera() {
    try {
        const { isMobile, isTablet } = getDeviceType();
        
        // Configuración más flexible - sin forzar dimensiones exactas
        let videoConstraints = {
            // Usar ideal sin exact para que el navegador elija lo mejor
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight },
            aspectRatio: { ideal: window.innerWidth / window.innerHeight }
        };
        
        if (isMobile) {
            // Móvil: cámara trasera
            videoConstraints.facingMode = "environment";
        } else if (isTablet) {
            // Tablet: intentar trasera
            videoConstraints.facingMode = "environment";
        } else {
            // Escritorio: cámara frontal
            videoConstraints.facingMode = "user";
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: false
        });
        
        video.srcObject = stream;
        
        // Esperar a que el video esté listo y ajustarlo al contenedor
        video.onloadedmetadata = () => {
            video.play();
            ajustarVideoAlContenedor();
        };
        
    } catch (error) {
        console.error("Error accessing the camera: ", error);
        
        // Fallback sin restricciones estrictas
        try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            video.srcObject = fallbackStream;
        } catch (fallbackError) {
            alert("Unable to access the camera. Please check your permissions and try again.");
        }
    }
}

// Función para ajustar el video al contenedor sin deformarse
function ajustarVideoAlContenedor() {
    const container = video.parentElement; // Asume que el video tiene un contenedor padre
    
    // Aplicar estilos CSS para que el video se ajuste correctamente
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover"; // Esto evita que se vea "mocha"
    // O usa "contain" si quieres ver todo el video sin cortar
}

startCamera();

// Reaccionar a cambios de tamaño (responsive)
window.addEventListener('resize', () => {
    if (video.srcObject) {
        ajustarVideoAlContenedor();
    }
});

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
