if (!document.getElementById("estadisticas-container")){
    const btnFunciones = document.getElementById('btnFunciones');
    const reservasFormulario = document.getElementById('overlay');
    
    btnFunciones.addEventListener('click', () => {
        reservasFormulario.classList.toggle('active');
    });
}


let aulas = JSON.parse(localStorage.getItem("aulas")) || [];

const formularioAulas = document.getElementById("aulas-formulario")

let aulasEditando = null;


let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

const formularioReservas = document.getElementById("reservas-formulario");

let reservasEditando = null;


let incidencias = JSON.parse(localStorage.getItem("incidencias")) || [];

const formularioIncidencias = document.getElementById("incidencias-formulario");

let incidenciaEditando = null;


let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const formularioTareas = document.getElementById("tareas-formulario");

let tareasEditando = null;


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("incidencias-container")) {
        RenderizarSelectAulas();
        RenderizarIncidencias(incidencias);
        formularioIncidencias.addEventListener("submit", (e) => {
        
            e.preventDefault();
        
            const formData = new FormData(formularioIncidencias);
        
            const datos = Object.fromEntries(formData.entries());

            const aulaFuera = aulas.find(a => a.id == datos.aulaId && a.estado == "fueraServicio");

            if(aulaFuera){
                alert("No se pueden crear incidencias para aulas fuera de servicio");
                return;
            }

            if(!datos.aulaId || !datos.responsable || !datos.tipo || !datos.prioridad || !datos.fecha || !datos.descripcion || !datos.estado){
                alert("Por favor, complete todos los campos");
                return;
            }

            
        
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

            RenderizarAulas(aulas);

            RenderizarSelectAulas();
        
            formularioIncidencias.reset();
        
        });
    }
    
    if (document.getElementById("aulas-container")) {
        RenderizarAulas(aulas);
        formularioAulas.addEventListener("submit", (e) => {
            e.preventDefault();
        
            const formDataAulas = new FormData(formularioAulas);
        
            const datosAulas = Object.fromEntries(formDataAulas.entries());

            if(!datosAulas.nombre || !datosAulas.capacidad || !datosAulas.cantidad || !datosAulas.estado){
                alert("Por favor, complete todos los campos");
                return;
            }
        
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
    }

    if (document.getElementById("reservas-container")) {
        RenderizarSelectAulas();
        RenderizarReservas(reservas);
        formularioReservas.addEventListener("submit", (e) => {
            e.preventDefault();
        
            const formDataReservas = new FormData(formularioReservas);
        
            const datosReservas = Object.fromEntries(formDataReservas.entries());
        
            const aula = aulas.find(a => a.id == datosReservas.aulaId);

            if(!datosReservas.aulaId || !datosReservas.docente || !datosReservas.curso || !datosReservas.aulaId || !datosReservas.fecha || !datosReservas.hora || !datosReservas.motivo){
                alert("Por favor, complete todos los campos");
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
    }

    if(document.getElementById("tareas-container")){
        RenderizarTareas(tareas);

        formularioTareas.addEventListener("submit", (e) => {
            e.preventDefault();

            const formDataTareas = new FormData(formularioTareas);

            const datosTareas = Object.fromEntries(formDataTareas.entries());

            if(tareasEditando){
                const tarea = tareas.find(t => t.id == tareasEditando);
                
                Object.assign(tarea, datosTareas);

                tareasEditando = null;

            }
            else{
                datosTareas.id = Date.now();

                tareas.push(datosTareas);
            }

            localStorage.setItem("tareas", JSON.stringify(tareas));
            RenderizarTareas(tareas);

            formularioTareas.reset();
        });
    }
});

function RenderizarIncidencias(array){

    const contenedor =
        document.getElementById("incidencias-container");

    contenedor.innerHTML = "";

    array.forEach((incidencia) => {

        const aula = aulas.find(a => a.id == incidencia.aulaId);

        contenedor.innerHTML += `
        <div class="card-incidencia">
            <div class="card-contenido">
                <div class="card-campos">
                    <div class="campo">
                        <span class="campo-label">Aula</span>
                        <span class="campo-valor">${aula ? aula.nombre : "Sin aula"}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Responsable</span>
                        <span class="campo-valor">${incidencia.responsable}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Tipo de problema</span>
                        <span class="campo-valor">${incidencia.tipo}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Prioridad</span>
                        <span class="campo-valor">${incidencia.prioridad}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Fecha</span>
                        <span class="campo-valor">${incidencia.fecha}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Estado</span>
                        <span class="campo-valor">${incidencia.estado}</span>
                    </div>
                </div>
                <div class="card-descripcion">
                    <span class="campo-label">Descripción</span>
                    <p>${incidencia.descripcion}</p>
                </div>
            </div>
            <div class="card-acciones">
                <button onclick="EditarIncidencia(${incidencia.id})">Editar</button>
                <button onclick="EliminarIncidencia(${incidencia.id})">Eliminar</button>
                <button onclick="CambiarEstadoIncidencia(${incidencia.id})">Cambiar estado</button>
            </div>
        </div>`;
    });
}

function EliminarIncidencia(id) {
    incidencias = incidencias.filter(
        incidencia => incidencia.id !== id
    )

    localStorage.setItem("incidencias", JSON.stringify(incidencias));

    RenderizarIncidencias(incidencias);

    RenderizarAulas(aulas);

    RenderizarSelectAulas();
}

function EditarIncidencia(id){
    const incidencia = incidencias.find(i => i.id == id);
    console.log(incidencia);
    const incidenciasFormulario = document.getElementById('overlay');
    incidenciasFormulario.classList.toggle('active');

    if(incidencia){
        incidenciaEditando = id;

        formularioIncidencias.aulaId.value = incidencia.aulaId;
        formularioIncidencias.responsable.value = incidencia.responsable;
        formularioIncidencias.tipo.value = incidencia.tipo;
        formularioIncidencias.fecha.value = incidencia.fecha;
        formularioIncidencias.descripcion.value = incidencia.descripcion;
        formularioIncidencias.estado.value = incidencia.estado;
        formularioIncidencias.prioridad.value = incidencia.prioridad;
    }
}

function CambiarEstadoIncidencia(id) {
    const incidencia = incidencias.find(i => i.id == id);

    const estados = ["pendiente", "en proceso", "resuelta"];
    const actual  = estados.indexOf(incidencia.estado);
    incidencia.estado = estados[(actual + 1) % estados.length];

    localStorage.setItem("incidencias", JSON.stringify(incidencias));

    RenderizarIncidencias(incidencias);
}

function RenderizarSelectAulas(){
    if (document.getElementById("incidencia-aula-select")){
        const selectIncidenciaAula = document.getElementById("incidencia-aula-select");
        
        selectIncidenciaAula.innerHTML = "";
    
        aulas.forEach((aula) => {
    
            selectIncidenciaAula.innerHTML += `
    
            <option value="${aula.id}">${aula.nombre}</option>
            
            `;
        });
    }

    if (document.getElementById("reservas-aula-select")){ 

        const selectReservaAula = document.getElementById("reservas-aula-select");
    
        selectReservaAula.innerHTML = "";
    
        aulas.forEach((aula) => {
    
            selectReservaAula.innerHTML += `
    
            <option value="${aula.id}">${aula.nombre}</option>
            
            `;
        });
    }
}

function FiltrarEstadoIncidencia(){
    const estadoSeleccionado = document.getElementById("incidencia-estado-filtro").value;

    if(estadoSeleccionado == ""){
        RenderizarIncidencias(incidencias);
        return;
    }

    const incidenciasFiltradas = incidencias.filter(i => i.estado == estadoSeleccionado);

    RenderizarIncidencias(incidenciasFiltradas);
}

function FiltrarPrioridadIncidencia(){
    const prioridadSeleccionada = document.getElementById("incidencia-prioridad-filtro").value;

    if(prioridadSeleccionada == ""){
        RenderizarIncidencias(incidencias);
        return;
    }

    const incidenciasFiltradas = incidencias.filter(i => i.prioridad == prioridadSeleccionada);

    RenderizarIncidencias(incidenciasFiltradas);
}


// Aulas

function RenderizarAulas(array){
    const contenedorAulas = document.getElementById("aulas-container");

    contenedorAulas.innerHTML = "";

    array.forEach((aula) => {
        const incidenciasCriticas = incidencias.filter(
            i => i.aulaId == aula.id && i.prioridad == "urgente"
        );

        contenedorAulas.innerHTML += `
        <div class="card-gestion-aula">
            <div class="card-contenido">
                <div class="card-campos">
                    <div class="campo">
                        <span class="campo-label">Nombre</span>
                        <span class="campo-valor">${aula.nombre}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Capacidad</span>
                        <span class="campo-valor">${aula.capacidad}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Cantidad de PCs</span>
                        <span class="campo-valor">${aula.cantidad}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Estado</span>
                        <span class="campo-valor">${aula.estado}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Incidencias críticas</span>
                        <span class="campo-valor">${incidenciasCriticas.length > 0 ? "Sí" : "No"}</span>
                    </div>
                </div>
            </div>
            <div class="card-acciones">
                <button onclick="EditarAula(${aula.id})">Editar</button>
                <button onclick="EliminarAula(${aula.id})">Eliminar</button>
            </div>
        </div>`;
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
    const aulasFormulario = document.getElementById('overlay');
    aulasFormulario.classList.toggle('active');

    if(aula){
        aulasEditando = id;

        formularioAulas.nombre.value = aula.nombre;
        formularioAulas.capacidad.value = aula.capacidad;
        formularioAulas.cantidad.value = aula.cantidad;
        formularioAulas.estado.value = aula.estado;
    }
}

function FiltrarEstadoAula(){
    const estadoSeleccionado = document.getElementById("aula-estado-filtro").value;

    if(estadoSeleccionado == ""){
        RenderizarAulas(aulas);
        return;
    }

    const aulasFiltradas = aulas.filter(a => a.estado == estadoSeleccionado);

    RenderizarAulas(aulasFiltradas);
}

//Reservas

function RenderizarReservas(array){
    const contenedorReservas = document.getElementById("reservas-container");

    contenedorReservas.innerHTML = "";

    array.forEach((r) => {
        const aula = aulas.find(a => a.id == r.aulaId);

        contenedorReservas.innerHTML += `
        <div class="card-reservas">
            <div class="card-contenido">
                <div class="card-campos">
                    <div class="campo">
                        <span class="campo-label">Docente</span>
                        <span class="campo-valor">${r.docente}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Curso</span>
                        <span class="campo-valor">${r.curso}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Aula</span>
                        <span class="campo-valor">${aula ? aula.nombre : "Sin aula"}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Fecha</span>
                        <span class="campo-valor">${r.fecha}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Horario</span>
                        <span class="campo-valor">${r.hora}</span>
                    </div>
                </div>
                <div class="card-descripcion">
                    <span class="campo-label">Motivo</span>
                    <p>${r.motivo}</p>
                </div>
            </div>
            <div class="card-acciones">
                <button onclick="EditarReserva(${r.id})">Editar</button>
                <button onclick="EliminarReserva(${r.id})">Eliminar</button>
            </div>
        </div>`;
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
    const reservasFormulario = document.getElementById('overlay');
    reservasFormulario.classList.toggle('active');

    if(reserva){
        reservasEditando = id;

        formularioReservas.docente.value = reserva.docente;
        formularioReservas.curso.value = reserva.curso;
        formularioReservas.fecha.value = reserva.fecha;
        formularioReservas.hora.value = reserva.hora;
        formularioReservas.motivo.value = reserva.motivo;
    }
}

//Tareas

function RenderizarTareas(array){
    const contenedorTareas = document.getElementById("tareas-container");

    contenedorTareas.innerHTML = "";

    array.forEach((tarea) => {
        contenedorTareas.innerHTML += `
        <div class="card-tarea">
            <div class="card-contenido">
                <div class="card-descripcion">
                    <span class="campo-label">Descripción</span>
                    <p>${tarea.descripcion}</p>
                </div>
                <div class="card-campos">
                    <div class="campo">
                        <span class="campo-label">Responsable</span>
                        <span class="campo-valor">${tarea.responsable}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Prioridad</span>
                        <span class="campo-valor">${tarea.prioridad}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Fecha Límite</span>
                        <span class="campo-valor">${tarea.fecha}</span>
                    </div>
                    <div class="campo">
                        <span class="campo-label">Estado</span>
                        <span class="campo-valor">${tarea.estado}</span>
                    </div>
                </div>
            </div>
            <div class="card-acciones">
                <div class="izquierda">
                    <button class="pointer" onclick="EditarTarea(${tarea.id})">Editar</button>
                    <button class="no-pointer">Marcar como Completada</button>
                    <button class="pointer" onclick="EliminarTarea(${tarea.id})">Eliminar</button>
                </div>
                <div class="derecha">
                    <input type="checkbox" ${tarea.completada ? "checked" : ""} onclick="MarcarCompletada(${tarea.id})"
                </div>
            </div>
        </div>`;
    });
}

function EliminarTarea(id){
    tareas = tareas.filter(t => t.id !== id);

    localStorage.setItem("tareas", JSON.stringify(tareas))

    RenderizarTareas(tareas);
}

function EditarTarea(id){
    const tarea = tareas.find(t => t.id == id);
    const tareasFormulario = document.getElementById('overlay');
    tareasFormulario.classList.toggle('active');

    if(tarea){
        tareasEditando = id;

        formularioTareas.responsable.value = tarea.responsable;
        formularioTareas.descripcion.value = tarea.descripcion;
        formularioTareas.fecha.value = tarea.fecha;
        formularioTareas.prioridad.value = tarea.prioridad;
        formularioTareas.estado.value = tarea.estado;
    }
}

function MarcarCompletada(id) {
    const tarea = tareas.find(t => t.id == id);

    tarea.completada = !tarea.completada;
    tarea.estado = tarea.completada ? "resuelta" : "en proceso";

    localStorage.setItem("tareas", JSON.stringify(tareas))

    RenderizarTareas(tareas);
}

function FiltrarEstadoTarea(){
    const estadoSeleccionado = document.getElementById("tarea-estado-filtro").value;

    if(estadoSeleccionado == ""){
        RenderizarTareas(tareas);
        return;
    }

    const tareasFiltradas = tareas.filter(t => t.estado == estadoSeleccionado);

    RenderizarTareas(tareasFiltradas);
}

function FiltrarPrioridadTarea(){
    const prioridadSeleccionada = document.getElementById("tarea-prioridad-filtro").value;

    if(prioridadSeleccionada == ""){
        RenderizarTareas(tareas);
        return;
    }

    const tareasFiltradas = tareas.filter(i => i.prioridad == prioridadSeleccionada);

    RenderizarTareas(tareasFiltradas);
}

function FiltrarVencidaTarea(){
    const vencidaSeleccionada = document.getElementById("tarea-vencida-filtro").value;

    if(vencidaSeleccionada == ""){
        RenderizarTareas(tareas);
        return;
    }

    const tareasFiltradas = tareas.filter(t => t.prioridad == vencidaSeleccionada);

    RenderizarTareas(tareasFiltradas);
}


if (document.getElementById("estadisticas-container")){
    const total = incidencias.length;
    const pendiente = incidencias.filter( i => i.estado != "resuelta").length;
    const resuelta = incidencias.filter( i => i.estado == "resuelta").length;
    const urgente = incidencias.filter( i => i.prioridad == "urgente").length;
    
    let fueraDeServicio = 0;
    aulas.forEach((a) => { 
        const fueraDeServicioAux = incidencias.some(i => i.aulaId == a.id && i.prioridad == "urgente");
        if (fueraDeServicioAux){
            fueraDeServicio++
        }
    });

    const resolucion = (resuelta * 100)/total;

    let aulaMayor = null;
    let mayorIncidencias = 0;
    aulas.forEach((a) => { 
        const cantidad = incidencias.filter(i => i.aulaId == a.id).length;
        if (cantidad > mayorIncidencias){
            aulaMayor = a.nombre;
            mayorIncidencias = cantidad;
        }
    });
    
    document.getElementById('total').textContent = total;
    document.getElementById('pendientes').textContent = pendiente;
    document.getElementById('resueltas').textContent = resuelta;
    document.getElementById('urgentes').textContent = urgente;
    document.getElementById('fuera-de-servicio').textContent = fueraDeServicio;
    document.getElementById('resolucion').textContent = resolucion.toFixed(2) + "%";
    document.getElementById('mayor-incidencia').textContent = aulaMayor + " con " + mayorIncidencias + " incidencias";
}