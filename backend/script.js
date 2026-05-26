let incidencias =
    JSON.parse(localStorage.getItem("incidencias")) || [];

const formularioIncidencias = document.getElementById("incidencias-formulario");

let incidenciaEditando = null;

RenderizarIncidencias(incidencias);



formularioIncidencias.addEventListener("submit", (e) => {

    e.preventDefault();

    const formData = new FormData(formularioIncidencias);

    const datos = Object.fromEntries(formData.entries());

    if(datos.descripcion.length < 10){
        alert("La descripción debe tener al menos 10 caracteres");
        return;
    }

    if(incidenciaEditando){
        const incidencia = incidencias.find(i => i.id === incidenciaEditando);

        Object.assign(incidencia, datos);

        incidenciaEditando = null;

    }else{
        datos.id = Date.now();
    
        incidencias.push(datos);
    }


    localStorage.setItem(
        "incidencias",
        JSON.stringify(incidencias)
    );

    RenderizarIncidencias(incidencias);

    formularioIncidencias.reset();

});

function RenderizarIncidencias(array){

    const contenedor =
        document.getElementById("incidencias-container");

    contenedor.innerHTML = "";

    array.forEach((incidencia) => {

        const aula = aulas.find(a => a.id == incidencia.aulaId);

        contenedor.innerHTML += `
        
        <div class="card">

            <span>ID: ${incidencia.id}</span>

            <h3>${aula ? aula.nombre : "Aula no encontrada"}</h3>
            
            <p>${incidencia.descripcion}</p>

            <span>Prioridad: ${incidencia.prioridad}</span>

            <button onclick="EliminarIncidencia(${incidencia.id})">Eliminar</button>

            <button onclick="EditarIncidencia(${incidencia.id})">Editar</button>

        </div>
        
        `;
    });
}

function EliminarIncidencia(id) {
    incidencias = incidencias.filter(
        incidencia => incidencia.id !== id
    )

    localStorage.setItem("incidencias", JSON.stringify(incidencias));

    RenderizarIncidencias(incidencias);
}

function EditarIncidencia(id){
    const incidencia = incidencias.find(i => i.id == id);
    console.log(incidencia);

    if(incidencia){
        incidenciaEditando = id;

        formularioIncidencias.aula.value = incidencia.aula;
        formularioIncidencias.responsable.value = incidencia.responsable;
        formularioIncidencias.tipo.value = incidencia.tipo;
        formularioIncidencias.fecha.value = incidencia.fecha;
        formularioIncidencias.descripcion.value = incidencia.descripcion;
        formularioIncidencias.estado.value = incidencia.estado;
        formularioIncidencias.prioridad.value = incidencia.prioridad;
    }
}

function RenderizarSelectAulas(){
    const selectIncidenciaAula = document.getElementById("incidencia-aula-select");
    const selectReservaAula = document.getElementById("reservas-aula-select");

    selectIncidenciaAula.innerHTML = "";

    aulas.forEach((aula) => {

        selectIncidenciaAula.innerHTML += `

        <option value="${aula.id}">${aula.nombre}</option>
        
        `;
    });

    selectReservaAula.innerHTML = "";

    aulas.forEach((aula) => {

        selectReservaAula.innerHTML += `

        <option value="${aula.id}">${aula.nombre}</option>
        
        `;
    });
}


// Aulas

let aulas = JSON.parse(localStorage.getItem("aulas")) || [];

RenderizarSelectAulas();

const formularioAulas = document.getElementById("aulas-formulario")

let aulasEditando = null;

RenderizarAulas(aulas);


formularioAulas.addEventListener("submit", (e) => {
    e.preventDefault();

    const formDataAulas = new FormData(formularioAulas);

    const datosAulas = Object.fromEntries(formDataAulas.entries());

    if(aulasEditando){
        const aula = aulas.find(a => a.id == aulasEditando);

        Object.assign(aula, datosAulas);

        aulasEditando = null;
    }
    else{
        datosAulas.id = Date.now();

        aulas.push(datosAulas);
    }

    localStorage.setItem("aulas", JSON.stringify(aulas));

    RenderizarAulas(aulas);

    RenderizarSelectAulas();

    formularioAulas.reset();

})

function RenderizarAulas(array){
    const contenedorAulas = document.getElementById("aulas-container");

    contenedorAulas.innerHTML = "";

    array.forEach((aula) => {

    const incidenciasCriticas = incidencias.filter(i => i.aulaId == datosReservas.aulaId && i.prioridad == "urgente");

    contenedorAulas.innerHTML += `
    
    <div class="card">

        <span>ID: ${aula.id}</span>

        <h3>${aula.nombre}</h3>
        
        <p>${aula.capacidad}</p>

        <span>cantidad: ${aula.cantidad}</span>

        <span>Estado: ${aula.estado}</span>

        <span>Incidencia crítica: ${incidenciasCriticas.length > 0 ? "Si" : "No"}</span>

        <button onclick="EliminarAula(${aula.id})">Eliminar</button>

        <button onclick="EditarAula(${aula.id})">Editar</button>

    </div>
    
    `;
    });
}

function EliminarAula(id) {
    aulas = aulas.filter(aula => aula.id !== id);

    localStorage.setItem("aulas", JSON.stringify(aulas));

    RenderizarAulas(aulas);

    RenderizarSelectAulas();
}

function EditarAula(id){
    const aula = aulas.find(a => a.id == id);
    console.log(aula);

    if(aula){
        aulasEditando = id;

        formularioAulas.nombre.value = aula.nombre;
        formularioAulas.capacidad.value = aula.capacidad;
        formularioAulas.cantidad.value = aula.cantidad;
        formularioAulas.estado.value = aula.estado;
    }
}

//Reservas

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

const formularioReservas = document.getElementById("reservas-formulario");

let reservasEditando = null;

RenderizarReservas(reservas);

formularioReservas.addEventListener("submit", (e) => {
    e.preventDefault();

    const formDataReservas = new FormData(formularioReservas);

    const datosReservas = Object.fromEntries(formDataReservas.entries());

    const aula = aulas.find(a => a.id == datosReservas.aulaId);


    if(incidenciasCriticas){
        alert("El aula seleccionada tiene incidencias críticas, por favor selecciona otra");
        return;
    }

    if(aula.estado == "ocupado"){
        alert("El aula seleccionada esta ocupada, por favor selecciona otra");
        return;
    }

    if(reservasEditando){
        const reserva = reservas.find(r => r.id == reservasEditando);

        Object.assign(reserva, datosReservas);

        reservasEditando = null;
    }
    else{
        datosReservas.id = Date.now();

        const ReservaExistente = reservas.find(r => r.aulaId == datosReservas.aulaId && r.fecha == datosReservas.fecha && r.hora == datosReservas.hora);

        if(ReservaExistente){
            alert("Ya existe una reserva para el aula, fecha y hora seleccionados");
            return;
        }

        reservas.push(datosReservas);
    }

    localStorage.setItem("reservas", JSON.stringify(reservas));

    RenderizarReservas(reservas);

    formularioReservas.reset();

})

function RenderizarReservas(array){
    const contenedorReservas = document.getElementById("reservas-container");

    contenedorReservas.innerHTML = "";

    array.forEach((reserva) => {

    const incidenciaCritica = incidencias.find(i => i.aulaId == reserva.aulaId && i.prioridad == "urgente");

    contenedorReservas.innerHTML += `
    
    <div class="card">

        <span>ID: ${reserva.id}</span>

        <h3>${reserva.docente}</h3>
        
        <p>${reserva.curso}</p>

        <span>cantidad: ${reserva.fecha}</span>

        <span>Estado: ${reserva.hora}</span>

        <p>${reserva.motivo}</p>


        <button onclick="EliminarReserva(${reserva.id})">Eliminar</button>

        <button onclick="EditarReserva(${reserva.id})">Editar</button>

    </div>
    
    `;
    });
}

function EliminarReserva(id) {
    reservas = reservas.filter(reserva => reserva.id !== id);

    localStorage.setItem("reservas", JSON.stringify(reservas));

    RenderizarReservas(reservas);
}

function EditarReserva(id){
    const reserva = reservas.find(r => r.id == id);
    console.log(reserva);

    if(reserva){
        reservasEditando = id;

        formularioReservas.docente.value = reserva.docente;
        formularioReservas.curso.value = reserva.curso;
        formularioReservas.fecha.value = reserva.fecha;
        formularioReservas.hora.value = reserva.hora;
        formularioReservas.motivo.value = reserva.motivo;
    }
}
