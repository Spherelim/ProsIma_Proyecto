document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById("anim1").addEventListener("click", function(e) {
         const normal = document.querySelector("#normal")
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");
       
        // Mostrar Baile1 y ocultar Baile2
        normal.setAttribute('visible','false');
        baile1.setAttribute('visible', 'true');
        baile2.setAttribute('visible', 'false');
        // Si quieres agregar animación al modelo
        baile1.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    });

    document.getElementById("anim2").addEventListener("click", function(e) {
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");
        
        // Mostrar Baile2 y ocultar Baile1
        baile2.setAttribute('visible', 'true');
        baile1.setAttribute('visible', 'false');
        
        // Si quieres agregar animación al modelo
        baile2.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    });

});