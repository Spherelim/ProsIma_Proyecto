
let EstadisticaData = {};

// Cargar los datos desde el archivo JSON
Promise.all([
    fetch('../data/EstadisticaData.json').then(res => res.json())
])
    .then(([Estadis]) => {
        EstadisticaData = Estadis;
        AgregarDatos();
    })
    .catch(error => console.error('Error al cargar los datos:', error));

function AgregarDatos() {

    const container = document.getElementById("cardConteiner");

    // Recorremos cada mundial
    for (let mundial in EstadisticaData) {

       const data = EstadisticaData[mundial];
    
       // Crear la estructura exacta que tenías en HTML
        const tarjeta = `
            <div class="imgContainer">

            <img id="idCard" src="../${data.imagen}" class="rounded-[20px] border-4  border-[#C30007] lg:w-[250px] lg:h-[370px]">
            <div class="h1 bg-[#333030be] relative top-[-90px]">
                <h1 class="text-center text-[30px] font-[Staatliches] 
            text-[#D9D9D9]">${mundial}</h1>
            </div>

        </div>
        `;
        
      
       container.innerHTML += tarjeta;

    }

}



