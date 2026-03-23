
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

        //portugal
        const portugalNormal = document.querySelector("#portugalNormal");
        const portugal1 = document.querySelector("#Portugal1");
        const portugal2 = document.querySelector("#Portugal2");


        //Francia
        const franciaNormal = document.querySelector("#franciaIdle");
        const francia1 = document.querySelector("#Francia1");
        const francia2 = document.querySelector("#Francia2");

        //EUA
        const EuaNormal = document.querySelector("#EuaNormal");
        const Eua1 = document.querySelector("#Eua1");
        const Eua2 = document.querySelector("#Eua2");

        //España
        const españaNormal = document.querySelector("#españaNormal");
        const esp1 = document.querySelector("#españa1");
        const esp2 = document.querySelector("#españa2");

        //corea
        const corea = document.querySelector("#coreaNormal");
        const cor1 = document.querySelector("#corea1");
        const cor2 = document.querySelector("#corea2");


        // Mostrar Baile1 y ocultar Baile2
        normal.setAttribute('visible', 'false');
        baile1.setAttribute('visible', 'true');
        baile2.setAttribute('visible', 'false');

        //portugal
        portugalNormal.setAttribute('visible', 'false');
        portugal1.setAttribute('visible', 'true');
        portugal2.setAttribute('visible', 'false');


        //Francia
        franciaNormal.setAttribute('visible', 'false');
        francia1.setAttribute('visible', 'true');
        francia2.setAttribute('visible', 'false');


        //EUA    
        EuaNormal.setAttribute('visible', 'false');
        Eua1.setAttribute('visible', 'true');
        Eua2.setAttribute('visible', 'false');

        //España
        españaNormal.setAttribute('visible', 'false');
        esp1.setAttribute('visible', 'true');
        esp2.setAttribute('visible', 'false');

        //corea
        corea.setAttribute('visible', 'false');
        cor1.setAttribute('visible', 'true');
        cor2.setAttribute('visible', 'false');

        // Si quieres agregar animación al modelo
        baile1.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    });

    document.getElementById("anim2").addEventListener("click", function (e) {
        const normal = document.querySelector("#normal")
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");

        //portugal
        const portugalNormal = document.querySelector("#portugalNormal");
        const portugal1 = document.querySelector("#Portugal1");
        const portugal2 = document.querySelector("#Portugal2");

        //Francia
        const franciaNormal = document.querySelector("#franciaIdle");
        const francia1 = document.querySelector("#Francia1");
        const francia2 = document.querySelector("#Francia2");

        //EUA
        const EuaNormal = document.querySelector("#EuaNormal");
        const Eua1 = document.querySelector("#Eua1");
        const Eua2 = document.querySelector("#Eua2");

        //España
        const españaNormal = document.querySelector("#españaNormal");
        const esp1 = document.querySelector("#españa1");
        const esp2 = document.querySelector("#españa2");

        //corea
        const corea = document.querySelector("#coreaNormal");
        const cor1 = document.querySelector("#corea1");
        const cor2 = document.querySelector("#corea2");


        // Mostrar Baile2 y ocultar Baile1
        normal.setAttribute('visible', 'false');
        baile2.setAttribute('visible', 'true');
        baile1.setAttribute('visible', 'false');


        //portugal
        portugalNormal.setAttribute('visible', 'false');
        portugal1.setAttribute('visible', 'false');
        portugal2.setAttribute('visible', 'true');


        //Francia
        franciaNormal.setAttribute('visible', 'false');
        francia1.setAttribute('visible', 'false');
        francia2.setAttribute('visible', 'true');

        //EUA
        EuaNormal.setAttribute('visible', 'false');
        Eua1.setAttribute('visible', 'false');
        Eua2.setAttribute('visible', 'true');

        //España
        españaNormal.setAttribute('visible', 'false');
        esp1.setAttribute('visible', 'false');
        esp2.setAttribute('visible', 'true');

        //corea
        corea.setAttribute('visible', 'false');
        cor1.setAttribute('visible', 'false');
        cor2.setAttribute('visible', 'true');
        
        // Si quieres agregar animación al modelo
        baile2.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    });

    document.getElementById("btnClose").addEventListener("click", function (e) {
        const normal = document.querySelector("#normal")
        const baile1 = document.querySelector("#Baile1");
        const baile2 = document.querySelector("#Baile2");


        //portugal
        const portugalNormal = document.querySelector("#portugalNormal");
        const portugal1 = document.querySelector("#Portugal1");
        const portugal2 = document.querySelector("#Portugal2");


        //Francia
        const franciaNormal = document.querySelector("#franciaIdle");
        const francia1 = document.querySelector("#Francia1");
        const francia2 = document.querySelector("#Francia2");


        //EUA
        const EuaNormal = document.querySelector("#EuaNormal");
        const Eua1 = document.querySelector("#Eua1");
        const Eua2 = document.querySelector("#Eua2");

        //España
        const españaNormal = document.querySelector("#españaNormal");
        const esp1 = document.querySelector("#españa1");
        const esp2 = document.querySelector("#españa2");


        //corea
        const corea = document.querySelector("#coreaNormal");
        const cor1 = document.querySelector("#corea1");
        const cor2 = document.querySelector("#corea2");


        // Mostrar Baile1 y ocultar Baile2
        normal.setAttribute('visible', 'true');
        baile1.setAttribute('visible', 'false');
        baile2.setAttribute('visible', 'false');

        //portugal
        portugalNormal.setAttribute('visible', 'true');
        portugal1.setAttribute('visible', 'false');
        portugal2.setAttribute('visible', 'false');

        //Francia
        franciaNormal.setAttribute('visible', 'true');
        francia1.setAttribute('visible', 'false');
        francia2.setAttribute('visible', 'false');

        //EUA
        EuaNormal.setAttribute('visible', 'true');
        Eua1.setAttribute('visible', 'false');
        Eua2.setAttribute('visible', 'false');

        //España
        españaNormal.setAttribute('visible', 'true');
        esp1.setAttribute('visible', 'false');
        esp2.setAttribute('visible', 'false');

        //corea
        corea.setAttribute('visible', 'true');
        cor1.setAttribute('visible', 'false');
        cor2.setAttribute('visible', 'false');

    });


});

