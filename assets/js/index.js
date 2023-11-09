
const modalActividadBS = document.getElementById('modalActividad');
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
                <button class="btn btn-${actividad.estado==="Pendiente" ? 'success' : 'secondary'} " ${actividad.estado==="Finalizado" && 'disabled'} 
                    onclick="completarActividad(${actividad.ID})">
                    Finalizar
                </button>
    
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

function resetForm(){
    document.getElementById("actividadForm").reset()
}

function abrirForm(){
    const modal = document.getElementById('modalActividad');
    modal.querySelector('.modal-title').textContent = "Crear nueva actividad";
    $('#submitEdit').hide();
    $('#botonCrear').show();
    resetForm();
}

async function crearActividad(){
    const modal = document.getElementById('modalActividad');

    let nuevaActividad = {};

    const descripcion = modal.querySelector("#descripcion").value
    const dias = modal.querySelector("#dias").value
    const fechaInicio = modal.querySelector("#fechaInicio").value
    const fechaFin = modal.querySelector("#fechaFin").value
    const responsable = modal.querySelector("#responsable").value
    
    if(descripcion === "" || (dias === "" || dias <= 0) || fechaInicio === "" || fechaFin === "" || responsable === ""){
        alert("Datos erróneos, verifique")
    } else {
        nuevaActividad = {
            ID: actividades.length+1,
            descripcion: descripcion,
            dias: dias,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            estado: "Pendiente",
            responsable: responsable
        }
        const xhttp = new XMLHttpRequest();
        const jsonData = JSON.stringify(nuevaActividad)
    
        xhttp.open("POST", "https://sheet.best/api/sheets/14a65b8d-0e33-4138-86d4-f694dc4d93c5", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(jsonData);
        xhttp.onload = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.response);
                console.log(data)

                cargarData();

                // alert("Datos enviados");
                document.querySelector('#cerrarModal').click();
            } else {
                console.log(xhttp.responseText)
            }
        }
    }
}

function editarActividad(id){
    const modal = document.getElementById('modalActividad');
    modal.querySelector('.modal-title').textContent = "Editar actividad";
    const actSeleccionada = actividades.find((actividad) => parseInt(actividad.ID) === id)

    // Modificar valores de inputs
    const descripcion = modal.querySelector("#descripcion");
    const dias = modal.querySelector("#dias");
    const fechaInicio = modal.querySelector("#fechaInicio");
    const fechaFin = modal.querySelector("#fechaFin");
    const responsable = modal.querySelector("#responsable");

    if(actSeleccionada){
        // Obtener el índice de la actividad en el array, para enviar como parámetro en URL
        const indexAct = actividades.indexOf(actSeleccionada, 0);

        descripcion.value = actSeleccionada.descripcion;
        dias.value = actSeleccionada.dias;
        fechaInicio.value = actSeleccionada.fechaInicio;
        fechaFin.value = actSeleccionada.fechaFin;
        responsable.value = actSeleccionada.responsable;

        $('#botonCrear').hide();
        $('#submitEdit').show();
        $('#submitEdit').click(function (e) { 
            e.preventDefault();
            submitEdit(id, indexAct);
        });
    } else {
        console.log("No encontrado. ID: " + id)
    }
}
async function submitEdit(id, index){
    const descripcion = modalActividadBS.querySelector("#descripcion").value
    const dias = modalActividadBS.querySelector("#dias").value
    const fechaInicio = modalActividadBS.querySelector("#fechaInicio").value
    const fechaFin = modalActividadBS.querySelector("#fechaFin").value
    const responsable = modalActividadBS.querySelector("#responsable").value
    
    if(descripcion === "" || (dias === "" || dias <= 0) || fechaInicio === "" || fechaFin === "" || responsable === ""){
        alert("Datos erróneos, verifique")
    } else {
        actEditada = {
            ID: id,
            descripcion: descripcion,
            dias: dias,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            estado: "Pendiente",
            responsable: responsable
        }
        const xhttp = new XMLHttpRequest();
        const jsonData = JSON.stringify(actEditada)
    
        xhttp.open("PUT", `https://sheet.best/api/sheets/14a65b8d-0e33-4138-86d4-f694dc4d93c5/${index}`, true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(jsonData);
        xhttp.onload = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.response);
                console.log(data)

                cargarData();

                // alert("Datos enviados");
                document.querySelector('#cerrarModal').click();
            } else {
                console.log(xhttp.responseText)
            }
        }
    }
}

async function eliminarActividad(id){
    const actSeleccionada = actividades.find((actividad) => parseInt(actividad.ID) === id)
    const indexAct = actividades.indexOf(actSeleccionada);

    if(indexAct > -1){
        const xhttp = new XMLHttpRequest();
    
        xhttp.open("DELETE", `https://sheet.best/api/sheets/14a65b8d-0e33-4138-86d4-f694dc4d93c5/${indexAct}`, true);
        xhttp.send();
        xhttp.onload = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.response);
                console.log(data)

                cargarData();

                // alert("Datos enviados");
                document.querySelector('#cerrarModal').click();
            } else {
                console.log(xhttp.responseText)
            }
        }
    } else {
        alert("No se encontró la actividad a eliminar")
    }
}

async function completarActividad(id){
    // alert("Finalizando tarea: "+ id)
    const actSeleccionada = actividades.find((actividad) => parseInt(actividad.ID) === id)
    const indexAct = actividades.indexOf(actSeleccionada);

    if(indexAct > -1){
        const actEditada = {
            ...actSeleccionada,
            estado: "Finalizado"
        }

        const xhttp = new XMLHttpRequest();
        const jsonData = JSON.stringify(actEditada)
    
        xhttp.open("PATCH", `https://sheet.best/api/sheets/14a65b8d-0e33-4138-86d4-f694dc4d93c5/${indexAct}`, true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(jsonData);
        xhttp.onload = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.response);
                console.log(data)

                cargarData();

                // alert("Datos enviados");
                document.querySelector('#cerrarModal').click();
            } else {
                console.log(xhttp.responseText)
            }
        }
    } else {
        alert("No se encontró la actividad a finalizar")
    }

}