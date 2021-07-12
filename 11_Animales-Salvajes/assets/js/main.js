//Dividir el código en módulos

import { Leon, Lobo, Oso, Serpiente, Aguila } from "./especie.js";
import animalesImg from "./imagenes.js";
import animalesSonido from "./sonido.js";

//Se agrega Font Awesome para ocupar el icono de sonido
document.querySelector("head").innerHTML +=
    `<!--Font Awesome 5.15.3-->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css" integrity="sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk" crossorigin="anonymous">`;


var animales = [];
var arrComentarios = [];

//Crear las instancias de las clases utilizando los datos del formulario
document.getElementById("btnRegistrar").addEventListener("click", () => {
    let nombre = document.getElementById("animal").value;
    let edad = document.getElementById("edad").value;
    let comentarios = document.getElementById("comentarios").value;
    let img = document.querySelector("#preview img").src;
    let sonido = document.getElementById("player").src;

    let registrado;
    switch (nombre) {
        case "Leon": registrado = new Leon(nombre, edad, img, comentarios, sonido);
            break;
        case "Lobo": registrado = new Lobo(nombre, edad, img, comentarios, sonido);
            break;
        case "Oso": registrado = new Oso(nombre, edad, img, comentarios, sonido);
            break;
        case "Serpiente": registrado = new Serpiente(nombre, edad, img, comentarios, sonido);
            break;
        case "Aguila": registrado = new Aguila(nombre, edad, img, comentarios, sonido);
            break;
    }

    //Validar que el usuario haya asignado todos los datos del animal antes de que éste sea agregado a la tabla    
    if (nombre && edad && comentarios) {
        animales.push(registrado);
        arrComentarios.push(comentarios);            
        agregarTabla();
        sonar();
        mostrarModal();
        limpiarDatos();

    } else {
        alert("Faltan datos por llenar");
    };    
});


//Utilizar la manipulación del DOM para mostrar en la tabla los animales registrados con el formulario
const agregarTabla = () => {
    const animalesTemplate = document.getElementById("Animales");
    animalesTemplate.innerHTML = "";     
    animales.forEach((animal) => {     
        animalesTemplate.innerHTML +=
            `<div class="card float-left mx-2 mb-2">
                <img src="${animal.getImg()}" class="imgModal" style= "cursor:pointer; height:188px; width:150px";>                                 
                <div class="card-footer bg-secondary p-0">
                    <button class="btn-play btn text-light text-center"><i style= "font-size: 20px" class="fas fa-volume-down"></i></button>                                                            
                </div>
            </div>`;  
    }); 
};

//Programar la interacción del botón de audio para reproducir el sonido del animal en el sitio web
const sonar = () => {
    document.querySelectorAll(".btn-play").forEach((button, i) => {        
        button.addEventListener("click", () => {        
            switch (animales[i].nombre) {
                case "Leon": animales[i].rugir();
                    break;
                case "Lobo": animales[i].aullar();
                    break;
                case "Oso": animales[i].grunir();
                    break;
                case "Serpiente": animales[i].sisear();
                    break;
                case "Aguila": animales[i].chillar();
                    break;
            }
        })
    });
}

//Mostrar el detalle de cada animal en una ventana modal al ser presionada su imagen
const mostrarModal = () => {
    document.querySelectorAll(".imgModal").forEach((card, i) => {
      
        let modal = document.getElementsByClassName("modal-body")[0];                  
        card.addEventListener("click", () => {
            modal.innerHTML =
                `<div class="text-light text-center">                    
                    <img width="200px" src="${animales[i].getImg()}">
                    <h6 class="pt-2">${animales[i].getEdad()}</h6>
                    <h6>Comentarios</h6>
                    <hr>
                    <p>${arrComentarios[i]}</p> 
                </div>`
            $('#exampleModal').modal('show');
        });        
    });
}

//Devolver el formulario en un estado inicial luego de registrar a cada animal
const limpiarDatos = () => {
    document.getElementById("animal").selectedIndex = 0;
    document.getElementById("edad").selectedIndex = 0;
    document.getElementById("comentarios").value = "";
    document.getElementById("preview").innerHTML = "";
}


