
const btnFolder = document.querySelector(".btnFolder");
const folderIcon = document.getElementById("Folder");
const btnAnim1 = document.getElementById("anim1");
const btnAnim2 = document.getElementById("anim2");

let abierto = false;

btnFolder.addEventListener("click", () => {


    abierto = !abierto;
    if (abierto) {

        folderIcon.src = "/Public/image/folder-symlink-fill.png";
        btnAnim1.style.display = "inline-block";
        btnAnim2.style.display = "flex";
    } else {


        folderIcon.src = "/Public/image/icon-folder.png";
        btnAnim1.style.display = "none";
        btnAnim2.style.display = "none";
    }
})




document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("anim1").addEventListener("click", function (e) {
        const normal = document.querySelector("#normal")
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");

        // Mostrar Baile1 y ocultar Baile2
        normal.setAttribute('visible', 'false');
        baile1.setAttribute('visible', 'true');
        baile2.setAttribute('visible', 'false');
        // Si quieres agregar animación al modelo
        baile1.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    });

    document.getElementById("anim2").addEventListener("click", function (e) {
        const normal = document.querySelector("#normal")
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");

        // Mostrar Baile2 y ocultar Baile1
        normal.setAttribute('visible', 'false');
        baile2.setAttribute('visible', 'true');
        baile1.setAttribute('visible', 'false');

        // Si quieres agregar animación al modelo
        baile2.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    });

    document.getElementById("btnClose").addEventListener("click", function (e) {
        const normal = document.querySelector("#normal")
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");

        // Mostrar Baile1 y ocultar Baile2
        normal.setAttribute('visible', 'true');
        baile1.setAttribute('visible', 'false');
        baile2.setAttribute('visible', 'false');

    });


});

