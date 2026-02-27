let indice = 1;
let triviaData = {};
let respuestasCorrectas = 0;

// Cargar los datos de las preguntas desde el archivo JSON
fetch('../data/TriviaData.json')
    .then(response => response.json())
    .then(data => {
        triviaData = data;
        mostrarPregunta(indice);
    })
    .catch(error => console.error('Error al cargar los datos de las preguntas:', error));


function mostrarPregunta(indice) {

    const wrapper = document.querySelector('.wrapper-preguntas');
    
    while(indice <= 10 && triviaData[`Pregunta_${indice}`]?.Acertivo){
        indice++;
    }
    
    if(indice > 10){
        if(RespondioCorrectamenteTodaTrivia()){
            alert("¡Felicidades! Has respondido correctamente todas las preguntas. 🎉");
            document.getElementById('titulo').textContent = "¡Felicidades!";
            document.getElementById('pregunta').textContent = "Has respondido correctamente todas las preguntas. ¡Gracias por jugar!";
            wrapper.innerHTML = "";
        }else{
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

    for(let i = 1; i <= 10; i++){
        if(!triviaData[`Pregunta_${i}`].Acertivo){
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
    
    if(esCorrecta){
        triviaData[`Pregunta_${indice}`].Acertivo = true;
        alert("¡Video Desbloqueado! 🎉");

        indice++;
        if(indice<=10){
            mostrarPregunta(indice);
        }
    }else{
        alert("Respuesta incorrecta, intenta de nuevo.");
    }
}

function validarRespuesta(opcionSeleccionada) {
    const pregunta = triviaData[`Pregunta_${indice}`];

    const Validar = pregunta.correcta === opcionSeleccionada;
    respuestaCorrecta(Validar);
}