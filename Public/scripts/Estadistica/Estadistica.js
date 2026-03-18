
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
            <td>${mundial} <img src="../${data.imagen}" id="Cedes"></td>
            <td><img src="../${data.cede}" alt="cede" id="Mundiales"></td>
            <td>
                <img src="../${data.final.equipo1}" alt="eq1">
                vs
                <img src="../${data.final.equipo2}" alt="eq2">
            </td>
            <td>${data.resultado}</td>
            <td><img src="../${data.ganador}" alt="ganador"></td>
        `;

        tabla.appendChild(fila);
    }

}