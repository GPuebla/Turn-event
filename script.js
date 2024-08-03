let usuarios = [];

// Cargar datos de usuarios
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        usuarios = data;
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

// Manejar el cambio en el menú de barrios
document.getElementById("barrio").addEventListener("change", function(event) {
    actualizarNombres();
});

// Manejar el cambio en el menú de asignaciones
document.getElementById("asignacion").addEventListener("change", function(event) {
    actualizarNombres();
});

// Actualizar el desplegable de nombres en base al barrio y asignación seleccionados
function actualizarNombres() {
    const barrioSeleccionado = document.getElementById("barrio").value;
    const asignacionSeleccionada = document.getElementById("asignacion").value;
    const nombreSelect = document.getElementById("nombre");

    // Limpiar opciones previas
    nombreSelect.innerHTML = '<option value="">Seleccione su nombre</option>';

    // Filtrar usuarios por barrio y asignación seleccionados
    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.barrio === barrioSeleccionado && usuario.asignacion === asignacionSeleccionada
    );

    // Agregar opciones al menú desplegable de nombres
    usuariosFiltrados.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.nombre;
        option.textContent = usuario.nombre;
        nombreSelect.appendChild(option);
    });
}

// Manejar el envío del formulario
document.getElementById("consultaForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const resultadoDiv = document.getElementById("resultado");

    // Buscar el usuario seleccionado
    const usuario = usuarios.find(u => u.nombre === nombre);

    if (usuario) {
        let resultadoHTML = `<h3>Resultados para ${usuario.nombre}</h3>`;
        
        // Filtrar fechas que no tengan turno asignado
        const fechasAsignadas = usuario.fechas.filter(fecha => fecha.turno !== "N/A");

        if (fechasAsignadas.length > 0) {
            fechasAsignadas.forEach(fecha => {
                resultadoHTML += `
                    <div class="resultado-fecha">
                        <p><strong>Fecha:</strong> ${fecha.fecha}</p>
                        <p><strong>Turno:</strong> ${fecha.turno}</p>
                    </div>
                `;
            });
        } else {
            resultadoHTML += "<p>No tienes turnos asignados para las fechas seleccionadas.</p>";
        }

        resultadoDiv.innerHTML = resultadoHTML;
    } else {
        resultadoDiv.innerHTML = "<p>No se encontraron turnos para el nombre seleccionado.</p>";
    }

    resultadoDiv.style.display = "block";
});
