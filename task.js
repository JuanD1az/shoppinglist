const input = document.querySelector("#task-header input");
const tasks = document.querySelector("#task-body ul");

let lista;
let maxFill = 0;
let fill = 0;
let ingresados = 0;

//Agregar evento enter al input
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnAdd").click();
    }
});

//Funcion para generar HTML
function createTask(task, id, done){
    //Aumenta el contador de ingresados
    ingresados++;
    
    //Genera el contenedor de la tarea
    taskLi = document.createElement("li");
    taskLi.classList.add("task-container");
    taskLi.setAttribute('id', id);

    //Crea el checkbox de completado
    taskCheckbox = document.createElement("input");
    taskCheckbox.setAttribute('type', 'checkbox');
    taskCheckbox.setAttribute('aria-label', 'done-checkbox')
    taskCheckbox.setAttribute("onClick", `doneTask(${id})`);
    if(done){
        taskCheckbox.checked = true;
        taskLi.classList.add("done");
    };

    //Crea el texto
    taskText = document.createElement("p");
    taskText.textContent = task;

    //Crea el boton para eliminar
    taskDel = document.createElement("button");
    taskDel.innerHTML = "X";
    taskDel.setAttribute('type', 'button');
    taskDel.setAttribute("onClick", `removeTask(${id})`);

    //Junta todos los elementos creados
    taskLi.appendChild(taskCheckbox);
    taskLi.appendChild(taskText);
    taskLi.appendChild(taskDel);

    tasks.appendChild(taskLi);
}

//Funcion para agregar
function addTask(){
    //Recolectando datos
    const task = input.value;   

    //Validar que no sea una cadena vacia
    if(task.trim()){
        //Generando ID
        const id = new Date().getTime();

        //Agregando tarea
        createTask(task,id);
        lista.push({
            name : task,
            id : id,
            done: false
        });
        localStorage.setItem('ShoppingList',JSON.stringify(lista));

        //Limpiando input
        input.value = '';

        //Elimina un fill
        if(fill > 0){
            fillRemove();
        }
    }
}

//Funcion para eliminar
function removeTask(id){
    //Contador de tareas ingresadas
    ingresados--;

    //Buscando la tarea
    const index = lista.findIndex( item => item.id === id );

    //Valida si la encontro
    if (index > -1) {
        //Elimina la tarea
        lista.splice(index, 1);
        document.getElementById(id).remove();
        localStorage.setItem('ShoppingList',JSON.stringify(lista));

        //Calcula los fills que se utilizaran
        fill = maxFill - ingresados;

        //Agrega un fill
        if(fill > 0){
            fillAdd();
        }
    }
}

//Funcion para cambiar estado
function doneTask(id){
    //Buscando la tarea
    const index = lista.findIndex( item => item.id === id );

    //Valida si la encontro
    if (index > -1) {
        //Busca el contenedor y checkbox
        let container = document.getElementById(id);
        let checkbox = container.querySelector('input');

        //Cambia el estado de la tarea
        if(checkbox.checked){
            lista[index].done = true;
            container.classList.add("done");
        }else{
            lista[index].done = false;
            container.classList.remove("done");
        }
        localStorage.setItem('ShoppingList',JSON.stringify(lista));
    }
}

//Carga tareas del local storage
function loadList(array) {
    array.forEach(function(item){
        createTask(item.name,item.id,item.done);
    })
}

//Elimina fills
function fillRemove(){
    let fillList = document.querySelectorAll(".fill");
    fillList[--fill].remove();
}

//Agrega fills
function fillAdd(){
    taskLi = document.createElement("li");
    taskLi.classList.add("task-container");
    taskLi.classList.add("fill");

    tasks.appendChild(taskLi);
}

function fillCalculate(){
    //Elimina los fills existentes
    document.querySelectorAll(".fill").forEach(e => e.remove());
    
    //Calcula el maximo de fills
    if (screen.width <= 576){
        maxFill = Math.round(screen.height / 55) - 4;
    }else{
        maxFill = 9;
    }

    //Guarda la cantidad de fills que se usaran
    fill = maxFill - ingresados;

    //Crea los fills
    if(fill > 0){
        for(let i = 0; i < fill; i++){
            fillAdd();
        }
    }
}

//Trae las tareas guardadas en el local storage
const data = localStorage.getItem('ShoppingList');
if(data){
    lista = JSON.parse(data);
    loadList(lista);
    fillCalculate();
}else{
    lista = [];
}

//Detecta el cambio de tamaño de pantalla
window.addEventListener('resize', fillCalculate);