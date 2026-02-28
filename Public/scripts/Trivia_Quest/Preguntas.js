let indice = 1;
let triviaData = {};
let videoData = {};
let respuestasCorrectas = 0;

// Cargar los datos de las preguntas desde el archivo JSON
Promise.all([
    fetch('../data/TriviaData.json').then(res => res.json()),
    fetch('../data/VideoData.json').then(res => res.json())
])
    .then(([trivia, videos]) => {
        triviaData = trivia;
        videoData = videos;
        mostrarPregunta(indice);
    })
    .catch(error => console.error('Error al cargar los datos:', error));

function mostrarPregunta(indice) {

    const wrapper = document.querySelector('.wrapper-preguntas');

    while (indice <= 10 && triviaData[`Pregunta_${indice}`]?.Acertivo) {
        indice++;
    }

    if (indice > 10) {
        if (RespondioCorrectamenteTodaTrivia()) {

            Swal.fire({
                title: "¡Gracias por participar!",
                icon: "success",
                draggable: true,
                customClass: {
                    title: 'titleCard',
                    popup: 'bodyCard',
                    iconColor: 'colorIcon',
                    confirmButton: 'btnOk'

                }
            });
            document.getElementById('titulo').textContent = "¡Felicidades!";
            document.getElementById('pregunta').textContent = "Has respondido correctamente todas las preguntas. ¡Gracias por jugar!";
            wrapper.innerHTML = "";
        } else {
            ReiniciarContador();
        }
        return;
    }

    window.indice = indice;
    const pregunta = triviaData[`Pregunta_${indice}`];

    document.getElementById('titulo').textContent = `Pregunta ${indice}`;
    document.getElementById('pregunta').textContent = pregunta.Texto;

    let opcionesHTML = `
        <ul class="primeraFila">
            <li class="btn" onclick="validarRespuesta(0)">${pregunta.Opciones[0]}</li>
            <li class="btn" onclick="validarRespuesta(1)">${pregunta.Opciones[1]}</li>
        </ul>
        <ul class="segundaFila">
            <li class="btn" onclick="validarRespuesta(2)">${pregunta.Opciones[2]}</li>
             <li class="btn" onclick="validarRespuesta(3)">${pregunta.Opciones[3]}</li>
        </ul>
    `

    wrapper.innerHTML = opcionesHTML;

}

function RespondioCorrectamenteTodaTrivia() {
    let todasCorrectas = true;

    for (let i = 1; i <= 10; i++) {
        if (!triviaData[`Pregunta_${i}`].Acertivo) {
            todasCorrectas = false;
            break;
        }
    }

    return todasCorrectas;
}

function ReiniciarContador() {
    indice = 1;
    mostrarPregunta(indice);
}

function siguientePregunta() {
    indice++;
    mostrarPregunta(indice);
}

function respuestaCorrecta(esCorrecta) {

    if (esCorrecta) {
         

         // Actualizar trivia
        const preguntaActual = `Pregunta_${indice}`;
        triviaData[preguntaActual].Acertivo = true;
        
        const VideoDesbloquear = `video_${indice}`;
        videoData[VideoDesbloquear].Desbloqueado = true;

        // Buscar el video asociado a esta pregunta
        // for (let videoKey in videoData) {
        //     if (videoData[videoKey].PreguntaAsociada === preguntaActual) {
        //         videoData[videoKey].Desbloqueado = true;
               
        //     }
        // }
        

         
        // Guardar cambios
        // guardarEstadoVideos(videoData);
        

        /*  alert("¡Video Desbloqueado! 🎉"); */
        Swal.fire({
            title: "¡Video Desbloqueado!",
            icon: "success",
            draggable: true,
            customClass: {
                title: 'titleCard',
                popup: 'bodyCard',
                iconColor: 'colorIcon',
                confirmButton: 'btnOk'

            }
        });


        const puto = triviaData[preguntaActual].Acertivo;
        const marica = videoData[VideoDesbloquear].Desbloqueado;

        alert("indice: " + indice +
            "\n Video estado:" + marica +
            "\n Pregunta estado:" + puto
        );

        indice++;
        if (indice <= 10) {
            mostrarPregunta(indice);
        }
    } else {
        /* alert("Respuesta incorrecta, intenta de nuevo."); */
        Swal.fire({
            title: "Respuesta incorrecta, intenta de nuevo.",
            icon: "error",
            draggable: true,
            customClass: {
                title: 'titleCard',
                popup: 'bodyCard',
                iconColor: 'colorIcon',
                confirmButton: 'btnOk'
            }
        });
    }
}

function validarRespuesta(opcionSeleccionada) {
    const pregunta = triviaData[`Pregunta_${indice}`];

    const Validar = pregunta.correcta === opcionSeleccionada;
    respuestaCorrecta(Validar);
}


// function guardarEstadoVideos(videoData) {
//     localStorage.setItem('videoData', JSON.stringify(videoData));
// }