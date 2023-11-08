
var actividades = [];

async function cargarData(){
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = function () {
        if(xhttp.readyState === 4 && xhttp.status === 200){
            const data = JSON.parse(xhttp.response);
            console.log(data)

            cargarActividades(data);
            actividades = data;
        }
    }
    xhttp.open("GET", "https://sheet.best/api/sheets/14a65b8d-0e33-4138-86d4-f694dc4d93c5", true);
    xhttp.send();
}

function cargarActividades(cards){
    var contenido = "<section class='actividades-container'>";


    if(cards.length > 0){

        cards.map((actividad) => {
            const fecInicioParse = new Date(actividad.fechaInicio);
            let variant;
            if(actividad.estado === "Pendiente"){
                variant = ""
            } else if(actividad.estado === "En progreso"){

            }

            contenido += `<card class="card-actividad card">
            <div class="card-body">
                <div class="text-group text-header">
                    <span class="title">Descripción: </span>
                    <span>${actividad.descripcion}</span>
                </div>
                <div class="text-group">
                    <span class="title">Duración en días: </span>
                    <span>${actividad.dias}</span>
                </div>
                <div class="text-group">
                    <span class="title">Fecha de inicio: </span>
                    <span>${ actividad.fechaInicio === "" ? "Sin Iniciar" : fecInicioParse.toUTCString() }</span>
                </div>
                <div class="text-group">
                    <span class="title">Fecha de fin:</span>
                    <span>${ actividad.fechaFin === "" ? "Sin establecer" : actividad.fechaFin }</span>
                </div>
                <div class="text-group">
                    <span class="title">Estado: </span>
                    <span class='badge rounded-pill text-bg-${ actividad.estado === "Pendiente" ? 'secondary' : 'success'}'>
                        ${actividad.estado}
                    </span>
                </div>
                <div class="text-group">
                    <span class="title">Responsable: </span>
                    <span>${actividad.responsable} </span>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-${actividad.estado==="Pendiente" ? 'success' : 'secondary'} " ${actividad.estado==="Finalizado" && 'disabled'} onclick="completarActividad(${actividad.ID})">Finalizar</button>
    
                <div class="btn-group">
                    <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalActividad" data-bs-whatever="${actividad.ID}" onclick="editarActividad(${actividad.ID})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                        <span class="floatLabel label-editar">Editar actividad</span>
                    </button>
                    <button class="btn btn-danger" onclick="eliminarActividad(${actividad.ID})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                        <span class="floatLabel label-eliminar">Eliminar actividad</span>
                    </button>
                </div>
            </div>
            </card>`
        });
    } else {
        contenido += "No hay actividades pendientes...";
    }

    contenido += "</section>";

    document.getElementById("actividades").innerHTML = contenido; 
}

async function crearActividad(){
    const modal = document.getElementById('modalActividad');
    modal.querySelector('.modal-title').textContent = "Crear nueva actividad";

    modal.querySelector("#descripcion").value = "";
    modal.querySelector("#dias").value = "";
    modal.querySelector("#fechaInicio").value = "";
    modal.querySelector("#responsable").value = "";
    
}

async function editarActividad(id){
    const modal = document.getElementById('modalActividad');
    modal.querySelector('.modal-title').textContent = "Editar actividad";
    const actSeleccionada = actividades.find((actividad) => parseInt(actividad.ID) === id)

    // Modificar valores de inputs
    const descripcion = modal.querySelector("#descripcion");
    const dias = modal.querySelector("#dias");
    const fechaInicio = modal.querySelector("#fechaInicio");
    const responsable = modal.querySelector("#responsable");

    if(actSeleccionada){
        descripcion.value = actSeleccionada.descripcion;
        dias.value = actSeleccionada.dias;
        fechaInicio.value = actSeleccionada.fechaInicio;
        responsable.value = actSeleccionada.responsable;
    } else {
        console.log("No encontrado. Param: " + id)
    }
}

async function eliminarActividad(id){

}

async function completarActividad(id){

}