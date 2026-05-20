console.log("tu madre")

let incidencias = []

incidencias.push({
    id:1,
    aula:"5",
    responsable:"Aybasian",
    tipo:"comportamiento",
    descripcion:"el profe me dijo 'te garchho?'",
    prioridad:"media",
    fecha:"12/05/2026",
    estado:"pendiente"

})

incidencias.push({
    id:2,
    aula:"5",
    responsable:"Aybasian",
    tipo:"comportamiento",
    descripcion:"el?'",
    prioridad:"media",
    fecha:"12/05/2026",
    estado:"pendiente"

})

incidencias.push({
    id:3,
    aula:"5",
    responsable:"Aybasian",
    tipo:"comportamiento",
    descripcion:"el?'",
    prioridad:"media",
    fecha:"12/05/2026",
    estado:"pendiente"

})



function GuardarDatos() {
    localStorage.setItem("incidencias", JSON.stringify(incidencias))
}

function CargarDatos(){
    const datos = localStorage.getItem("incidencias");

    if (datos){
        return JSON.parse(datos); 
    }
}

function RenderizarIncidencias(array){
    const contenedor = document.getElementById("incidencias-container")
    contenedor.innerHTML = "";
    let contador = 0

    incidencias.forEach(incidencia => {
        console.log(contador);
        console.log(incidencia);
        contenedor.innerHTML += `<div class="card"><h3>${incidencia.aula}</h3><p>${incidencia.descripcion}</p><span>${incidencia.prioridad}</span></div>`;
        console.log(incidencias[contador].descripcion)
        contador ++
    })
}

function Enviar(){
    const CargaContainer = document.getElementsByClassName(".container");
    console.log(CargaContainer);
    incidencias.push({
        id:"5",
        aula:"5",
        responsable:"Aybasian",
        tipo:"comportamiento",
        descripcion:"el?'",
        prioridad:"media",
        fecha:"12/05/2026",
        estado:"pendiente"

    })
    RenderizarIncidencias(CargarDatos());
}



GuardarDatos();
RenderizarIncidencias(CargarDatos());



console.log(incidencias[0].descripcion)
console.log(CargarDatos())