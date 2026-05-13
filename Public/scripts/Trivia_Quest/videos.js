// videos.js - Modificado para mostrar video correctamente
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
        const link = e.target.closest("a");
        if (link) {
            const id = link.getAttribute("data-id");
            console.log("ID seleccionado:", id);
            mostrarPregunta(id);
        }
    });

    function mostrarPregunta(id) {
        const pregunta = preguntas[id];
        console.log("Pregunta encontrada:", pregunta);

        if (pregunta) {
            tituloEl.textContent = id.replace("_", " ");
            preguntaEl.textContent = pregunta.Texto;

            const videoAsociado = Object.values(videos).find(v => v.PreguntaAsociada === id);
            console.log("Video asociado:", videoAsociado);

            if (videoAsociado && videoAsociado.Desbloqueado) {
                // Limpiar y crear nuevo video
                videoContainer.innerHTML = `
                    <div class="cardQuestion">
                        <div class="card relative">
                            <video id="videoPlayer" class="videoPlayer w-full h-auto rounded-xl" controls>
                                <source src="${videoAsociado.Ruta}" type="video/mp4">
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    </div>
                `;
                
                console.log(" Video mostrado para:", id);
                
                // Disparar evento para que los filtros se apliquen
                const event = new CustomEvent('videoLoaded', { detail: { id: id } });
                document.dispatchEvent(event);
            } else {
                videoContainer.innerHTML = `
                    <img class="imgVideo w-full h-auto object-contain rounded-xl" 
                         src="../image/box-question.png" 
                         alt="Video bloqueado">
                `;

                if (!pregunta.Acertivo) console.log("❌ Pregunta no acertada");
                if (videoAsociado && !videoAsociado.Desbloqueado) console.log("🔒 Video no desbloqueado");
                if (!videoAsociado) console.log(" No hay video asociado");
            }
        } else {
            console.error("No se encontró la pregunta con id:", id);
        }
    }
});