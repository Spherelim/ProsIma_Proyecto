
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
            console.log(videosGuardados);
            if (videosGuardados) {
                videos = JSON.parse(videosGuardados);

                console.log("videos:" + videos);
            } else {
                videos = dataVideos;

                console.log("dataVideos:" + dataVideos);
            }
        })
        .catch(err => console.error("Error cargando JSON:", err));

    submenu.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "A") {
            const id = e.target.getAttribute("data-id");

            console.log("Este es el id: " + id);
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


            if (videoAsociado.Desbloqueado) {
                
                videoContainer.innerHTML = `
                
                <video class="videoPlayer" controls>
                    <source src="${videoAsociado.Ruta}" type="video/mp4">
                </video>
            `;
                console.log("Video mostrado para:", id);
            } else {
               
                videoContainer.innerHTML = '<img class="imgVideo" src="../image/box-question.png" alt="Video bloqueado">';

               
                if (!pregunta.Acertivo) console.log("Pregunta no acertada");
                if (videoAsociado && !videoAsociado.Desbloqueado) console.log("Video no desbloqueado");
                if (!videoAsociado) console.log("No hay video asociado");
            }


        } else {

            console.error("No se encontró la pregunta con id:", id);

        }
    }


});