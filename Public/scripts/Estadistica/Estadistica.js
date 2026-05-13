
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

    const tabla = document.getElementById("tablaMundiales");

    // Recorremos cada mundial
    for (let mundial in EstadisticaData) {

        const data = EstadisticaData[mundial];

        // Crear fila
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td class="font-[Staatliches] text-center text-[10px] sm:text-[15px] md:text-[18px] lg:text-[25px] text-[#1A1F7A]">${mundial} 

            <div class="flex items-center justify-center gap-4">
            <img src="../${data.imagen}" id="Cedes" class="  w-7  md:w-12 lg:w-16 ">
            </div>
            
            </td>


            <td >
            <div class="flex items-center justify-center gap-4">
              <img src="../${data.cede}" alt="cede" id="Mundiales" class=" w-7  md:w-12 lg:w-16  rounded-full">
            </div>
           
            </td>

            
            <td class="font-[Staatliches] text-center text-[10px] sm:text-[15px]  lg:text-[25px] text-[#1A1F7A]" >
                 <div class="flex items-center justify-center gap-4">
                 <img src="../${data.final.equipo1}" alt="eq1" class="w-7  md:w-12 lg:w-16   h-auto">
                 <span class="font-bold text-[10px] md:text-[18px] lg:text-[25px]">vs</span>
                 <img src="../${data.final.equipo2}" alt="eq2" class="w-7  md:w-12 lg:w-16   h-auto">
            </div>
            </td>


            <td class="font-[Staatliches] text-center text-[10px] sm:text-[15px]  md:text-[18px] lg:text-[25px] text-[#1A1F7A]">${data.resultado}</td>


            <td >
            <div class="flex items-center justify-center gap-4">
            <img src="../${data.ganador}" alt="ganador" class="w-7  md:w-12 lg:w-16    content-center">
            </div>
            
            </td>
        `;

        tabla.appendChild(fila);
    }

}