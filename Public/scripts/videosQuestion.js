
//*Este es para el menu
document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.querySelector(".menu-toggle");
    const submenu = document.querySelector("nav");

    toggle.addEventListener("click", function() {
        submenu.classList.toggle("active");
    });
});


//*Este es para mandar los datos a titulo y pregunta


document.addEventListener("DOMContentLoaded", () => {
  const tituloEl = document.getElementById("titulo");
  const preguntaEl = document.getElementById("pregunta");
  const submenu = document.getElementById("submenu-preguntas");

  let preguntas = {};

 
  fetch("/Public/data/TriviaData.json")
    .then(res => res.json())
    .then(data => {
      preguntas = data;
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

    
    tituloEl.textContent = id.replace("_", " "); // Ej: "Pregunta 1"
    preguntaEl.textContent = pregunta.Texto;
  }
});

