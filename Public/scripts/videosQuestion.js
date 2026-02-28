
//*Este es para el menu
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const submenu = document.querySelector("nav");

    toggle.addEventListener("click", function () {
        submenu.classList.toggle("active");
    });
});


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
        if (videosGuardados) {
            videos = JSON.parse(videosGuardados);
        } else {
            videos = dataVideos;
        }
    })
    .catch(err => console.error("Error cargando JSON:", err));

    submenu.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "A") {
            const id = e.target.getAttribute("data-id");
            mostrarPregunta(id);
        }
    });

    function mostrarPregunta(id) {
        const pregunta = preguntas[id];

        if (!pregunta) return;

        const numero = id.split("_")[1];
        const videoId = `video_${numero}`;

        tituloEl.textContent = id.replace("_", " ");
        preguntaEl.textContent = pregunta.Texto;

        videoContainer.innerHTML = '<img class="imgVideo" src="../image/box-question.png" alt="">';

        // Verificar AMBAS condiciones: pregunta acertada Y video desbloqueado
        if (pregunta.Acertivo && videos[videoId]?.Desbloqueado) {
            videoContainer.innerHTML = `
                <video class="videoPlayer" controls>
                    <source src="${videos[videoId].Ruta}" type="video/mp4">
                    Tu navegador no soporta video.
                </video>
            `;
        }

        console.log("ID pregunta:", id);
        console.log("Pregunta Acertivo:", pregunta.Acertivo);
        console.log("ID video:", videoId);
        console.log("Video desbloqueado:", videos[videoId]?.Desbloqueado);
    }
});