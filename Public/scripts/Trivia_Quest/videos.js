//* videos.js - Versión corregida

//*Este es para mandar los datos a titulo y pregunta
document.addEventListener("DOMContentLoaded", () => {
    const tituloEl = document.getElementById("titulo");
    const preguntaEl = document.getElementById("pregunta");
    const submenu = document.getElementById("submenu-preguntas");
    const videoContainer = document.getElementById("videoContainer");

    let preguntas = {};
    let videos = {};

    Promise.all([
        fetch("/Public/data/TriviaData.json").then(res => res.json()),
        fetch("/Public/data/VideoData.json").then(res => res.json())
    ])
        .then(([dataPreguntas, dataVideos]) => {
            preguntas = dataPreguntas;

            // Cargar estado guardado de videos si existe
            const videosGuardados = localStorage.getItem('videoData');
            console.log("Videos guardados:", videosGuardados);
            
            if (videosGuardados) {
                videos = JSON.parse(videosGuardados);
                console.log("Videos cargados de localStorage:", videos);
            } else {
                videos = dataVideos;
                console.log("Videos cargados de JSON:", dataVideos);
            }
        })
        .catch(err => console.error("Error cargando JSON:", err));

    submenu.addEventListener("click", (e) => {
        e.preventDefault();
        const link = e.target.closest("a"); // Mejor que verificar tagName
        if (link) {
            const id = link.getAttribute("data-id");
            console.log("ID seleccionado:", id);
            mostrarPregunta(id);
        }
    });

    function mostrarPregunta(id) {
        // Busca la pregunta en el objeto preguntas 
        const pregunta = preguntas[id];
        console.log("Pregunta encontrada:", pregunta);

        if (pregunta) {
            tituloEl.textContent = id.replace("_", " ");
            preguntaEl.textContent = pregunta.Texto;

            const videoAsociado = Object.values(videos).find(v => v.PreguntaAsociada === id);
            console.log("Video asociado:", videoAsociado);

            if (videoAsociado && videoAsociado.Desbloqueado) {
                videoContainer.innerHTML = `
                    <div class="cardQuestion">
                        <div class="card">
                            <video id="videoPlayer" class="videoPlayer w-full h-auto rounded-xl" controls>
                                <source src="${videoAsociado.Ruta}" type="video/mp4">
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    </div>
                `;

                // Siempre pondrá el filtro aunque cambie de video
                if (typeof aplicarFiltroActual === 'function') {
                    aplicarFiltroActual();
                }

                console.log("✅ Video mostrado para:", id);
            } else {
                videoContainer.innerHTML = `
                    <img class="imgVideo w-full h-auto object-contain rounded-xl" 
                         src="../image/box-question.png" 
                         alt="Video bloqueado">
                `;

                if (!pregunta.Acertivo) console.log("❌ Pregunta no acertada");
                if (videoAsociado && !videoAsociado.Desbloqueado) console.log("🔒 Video no desbloqueado");
                if (!videoAsociado) console.log("⚠️ No hay video asociado");
            }
        } else {
            console.error("No se encontró la pregunta con id:", id);
        }
    }
});