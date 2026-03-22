const selectFiltro = document.getElementById("opcFiltro");

let filtroActual = "none";

function aplicarFiltroActual(){
    const video = document.getElementById("videoPlayer");
    if(video){
        video.style.filter = filtroActual;
    }
}

selectFiltro.addEventListener("change",()=>{
    switch(selectFiltro.value){
        case "default":
            filtroActual = "none"
            break;
        case "1":
            filtroActual = "grayscale(1)";
            break;
        case "2":
            filtroActual = "sepia(1)";
            break;
        case "3":
            filtroActual = "contrast(1.5) brightness(1.2)";
            break;
        case "4":
            filtroActual = "blur(5px)";
            break;
    }
    aplicarFiltroActual();
});
