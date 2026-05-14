// camara.js - Versión con 3 filtros (Normal, Glitch, Distorsión)
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
}

startCamera();

// Reaccionar a cambios de tamaño (responsive)
window.addEventListener('resize', () => {
    if (video.srcObject) {
        ajustarVideoAlContenedor();
    }
});

// ========== FILTROS (SOLO 3: Normal, Glitch, Distorsión) ==========
const filtros = document.querySelectorAll('.opcFiltro');
const overlay = document.getElementById('overlay');

// Aplicar filtro CSS a la etiqueta <video>
function aplicarFiltroCSS(tipo) {
    switch(tipo) {
        case 'normal':
            video.style.filter = 'none';
            break;
        case 'glitch':
            // Efecto glitch usando CSS filter compuesto
            video.style.filter = 'contrast(1.2) brightness(1.1)';
            // Añadir clase para efectos adicionales
            video.classList.add('glitch-effect');
            break;
        case 'distortion':
            // Efecto de distorsión pixelada + distorsión de color
            video.style.filter = 'contrast(1.5) saturate(1.8) hue-rotate(15deg) blur(0.5px)';
            video.classList.add('distortion-effect');
            break;
        default:
            video.style.filter = 'none';
    }
}

// Función para limpiar clases de efecto
function limpiarClasesEfecto() {
    video.classList.remove('glitch-effect', 'distortion-effect');
}

// Añadir estilos CSS para los efectos avanzados (se inyectan dinámicamente)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    /* Efecto Glitch - Simula canales RGB desplazados */
    .glitch-effect {
        animation: rgbShift 0.15s infinite alternate;
        position: relative;
    }
    
    @keyframes rgbShift {
        0% {
            filter: drop-shadow(-2px 0 0 rgba(255, 0, 0, 0.6)) drop-shadow(2px 0 0 rgba(0, 255, 255, 0.4));
        }
        25% {
            filter: drop-shadow(2px 0 0 rgba(255, 0, 0, 0.4)) drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.6));
        }
        50% {
            filter: drop-shadow(-3px 0 0 rgba(255, 0, 0, 0.5)) drop-shadow(3px 0 0 rgba(0, 255, 255, 0.3));
        }
        75% {
            filter: drop-shadow(1px 0 0 rgba(255, 0, 0, 0.7)) drop-shadow(-1px 0 0 rgba(0, 255, 255, 0.5));
        }
        100% {
            filter: drop-shadow(-2px 0 0 rgba(255, 0, 0, 0.3)) drop-shadow(2px 0 0 rgba(0, 255, 255, 0.7));
        }
    }
    
    /* Efecto Distorsión - Ondulación pixelada + ruido */
    .distortion-effect {
        animation: pixelDistortion 0.12s infinite steps(2);
        filter: contrast(1.5) saturate(1.8) hue-rotate(15deg) blur(0.3px);
    }
    
    @keyframes pixelDistortion {
        0% {
            clip-path: inset(0% 0% 0% 0%);
        }
        20% {
            clip-path: inset(2% 0% 1% 0%);
        }
        40% {
            clip-path: inset(1% 0% 2% 0%);
        }
        60% {
            clip-path: inset(0% 0% 3% 0%);
        }
        80% {
            clip-path: inset(3% 0% 0% 0%);
        }
        100% {
            clip-path: inset(0% 0% 0% 0%);
        }
    }
    
    /* Añadir ruido superpuesto para el efecto distorsión */
    .distortion-effect::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 2px,
            transparent 2px,
            transparent 4px
        );
        animation: noise 0.08s infinite;
        z-index: 10;
    }
    
    @keyframes noise {
        0% { opacity: 0.3; }
        50% { opacity: 0.6; }
        100% { opacity: 0.3; }
    }
    
    /* Posicionamiento relativo necesario para pseudo-elementos */
    video {
        position: relative;
    }
`;
document.head.appendChild(styleSheet);

// Eventos de los botones de filtro (solo 3 filtros)
// índice 0 = Normal, índice 1 = Glitch, índice 2 = Distorsión
filtros.forEach((filtro, index) => {
    filtro.addEventListener('click', () => {
        // Limpiar clases de efectos previos
        limpiarClasesEfecto();
        
        switch(index) {
            case 0: // Normal
                aplicarFiltroCSS('normal');
                break;
            case 1: // GLITCH
                aplicarFiltroCSS('glitch');
                break;
            case 2: // DISTORSIÓN
                aplicarFiltroCSS('distortion');
                break;
        }
    });
});

// ========== CAPTURA DE FOTO CON FILTROS ==========
const btnFoto = document.getElementById('btnFoto');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const preview = document.getElementById('preview');

// Función para aplicar efectos visuales complejos en el canvas (cuando se toma la foto)
function aplicarFiltroCanvas(ctx, ancho, alto, tipoFiltro) {
    const imageData = ctx.getImageData(0, 0, ancho, alto);
    const data = imageData.data;
    
    if (tipoFiltro === 'glitch') {
        // EFECTO GLITCH MANUAL: desplazar canales RGB aleatoriamente
        for (let y = 0; y < alto; y++) {
            // Solo aplicar glitch en bandas horizontales aleatorias
            if (Math.random() > 0.7) {
                const offsetX = Math.floor(Math.random() * 15) - 7; // -7 a 7 píxeles
                
                for (let x = 0; x < ancho; x++) {
                    const newX = x + offsetX;
                    if (newX >= 0 && newX < ancho) {
                        const idx = (y * ancho + x) * 4;
                        const newIdx = (y * ancho + newX) * 4;
                        
                        // Intercambiar canales de color para efecto RGB split
                        let r = data[newIdx];
                        let g = data[newIdx + 1];
                        let b = data[newIdx + 2];
                        
                        data[idx] = r;        // R
                        data[idx + 1] = g;    // G
                        data[idx + 2] = b;    // B
                    }
                }
            }
        }
        
        // Añadir "líneas de falla" horizontales
        for (let i = 0; i < 20; i++) {
            const lineaY = Math.floor(Math.random() * alto);
            const altura = Math.floor(Math.random() * 8) + 1;
            for (let y = lineaY; y < Math.min(lineaY + altura, alto); y++) {
                for (let x = 0; x < ancho; x++) {
                    const idx = (y * ancho + x) * 4;
                    // Invertir colores en la línea de falla
                    data[idx] = 255 - data[idx];
                    data[idx + 1] = 255 - data[idx + 1];
                    data[idx + 2] = 255 - data[idx + 2];
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
    } else if (tipoFiltro === 'distortion') {
        // EFECTO DISTORSIÓN: pixelado + efecto CRT + onda sinusoidal
        const pixelSize = 8; // Tamaño del píxel para efecto pixelado
        
        // 1. Crear una versión pixelada (efecto blocky)
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = ancho;
        tempCanvas.height = alto;
        
        // Dibujar imagen original reducida y ampliada para pixelado
        tempCtx.drawImage(video, 0, 0, ancho, alto);
        const smallWidth = Math.floor(ancho / pixelSize);
        const smallHeight = Math.floor(alto / pixelSize);
        
        tempCtx.drawImage(video, 0, 0, smallWidth, smallHeight);
        tempCtx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, smallWidth, smallHeight, 0, 0, ancho, alto);
        
        // 2. Obtener los datos pixelados y aplicar distorsión de onda
        const distortedData = ctx.getImageData(0, 0, ancho, alto);
        const distortedPixels = distortedData.data;
        
        // Crear un nuevo array para la distorsión (efecto de onda)
        const newPixels = new Uint8ClampedArray(distortedPixels.length);
        
        for (let y = 0; y < alto; y++) {
            // Onda sinusoidal para desplazar píxeles horizontalmente
            const offsetX = Math.sin(y * 0.05) * 15;
            
            for (let x = 0; x < ancho; x++) {
                const srcX = Math.floor(x + offsetX);
                if (srcX >= 0 && srcX < ancho) {
                    const srcIdx = (y * ancho + srcX) * 4;
                    const dstIdx = (y * ancho + x) * 4;
                    
                    newPixels[dstIdx] = distortedPixels[srcIdx];
                    newPixels[dstIdx + 1] = distortedPixels[srcIdx + 1];
                    newPixels[dstIdx + 2] = distortedPixels[srcIdx + 2];
                    newPixels[dstIdx + 3] = 255;
                }
            }
        }
        
        // 3. Aplicar efecto de "scanline" (líneas de escaneo CRT)
        for (let y = 0; y < alto; y += 2) {
            for (let x = 0; x < ancho; x++) {
                const idx = (y * ancho + x) * 4;
                newPixels[idx] = Math.floor(newPixels[idx] * 0.7);     // R más oscuro
                newPixels[idx + 1] = Math.floor(newPixels[idx + 1] * 0.7); // G más oscuro
                newPixels[idx + 2] = Math.floor(newPixels[idx + 2] * 0.7); // B más oscuro
            }
        }
        
        // Aplicar los píxeles distorsionados
        const finalImageData = new ImageData(newPixels, ancho, alto);
        ctx.putImageData(finalImageData, 0, 0);
    }
}

// Variable para saber qué filtro está activo actualmente
let filtroActivo = 'normal';

filtros.forEach((filtro, index) => {
    filtro.addEventListener('click', () => {
        switch(index) {
            case 0: filtroActivo = 'normal'; break;
            case 1: filtroActivo = 'glitch'; break;
            case 2: filtroActivo = 'distortion'; break;
            default: filtroActivo = 'normal';
        }
    });
});

// Tomar foto con el filtro seleccionado
btnFoto.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Limpiar filtros CSS temporales del video para capturar imagen limpia base
    const filtroCSSGuardado = video.style.filter;
    const clasesGuardadas = video.classList.value;
    
    // Remover efectos visuales temporales para capturar imagen base limpia
    video.style.filter = 'none';
    video.classList.remove('glitch-effect', 'distortion-effect');
    
    // Dibujar el fotograma actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Aplicar filtros avanzados según el seleccionado
    if (filtroActivo === 'glitch') {
        aplicarFiltroCanvas(context, canvas.width, canvas.height, 'glitch');
    } else if (filtroActivo === 'distortion') {
        aplicarFiltroCanvas(context, canvas.width, canvas.height, 'distortion');
    }
    
    // Si hay un overlay (imagen superpuesta), dibujarlo encima
    if (overlay.src && overlay.src !== window.location.href) {
        context.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    }
    
    // Restaurar los filtros CSS del video para la vista previa
    video.style.filter = filtroCSSGuardado;
    video.classList.value = clasesGuardadas;
    
    // Generar imagen y guardar
    const dataURL = canvas.toDataURL('image/png');
    preview.src = dataURL;
    
    // Descargar automáticamente
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `foto_${filtroActivo}_${Date.now()}.png`;
    link.click();
});