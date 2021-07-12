//se crea la clase padre del proyecto
class Propietario {
    constructor(nombre, direccion, telefono){
        this._nombre = nombre;
        this._direccion = direccion;
        this._telefono = telefono;
    }
    datosPropietario(){
        return `El nombre del dueño es: ${this._nombre}. La dirección es: ${this._direccion}, y el número telefónico de contacto: ${this._telefono}`
    }
}

// se crea la clase Animal hija de la clase Propietario
class Animal extends Propietario {
    constructor(nombre, direccion, telefono, tipo){
        super(nombre, direccion, telefono);
        this._tipo = tipo;
    }
    get tipo(){
        return this._tipo;
    }
}

// se crea la clase Mascota hija de la clase Animal
class Mascota extends Animal {
    constructor(nombre, direccion, telefono, tipo, nombreMascota, enfermedad){
        super(nombre, direccion, telefono, tipo);
        this._nombreMascota = nombreMascota;
        this._enfermedad = enfermedad;
    }
    get nombre(){
        return this._nombreMascota;
    }
    set nombre(nuevo_nombre){
        this._nombreMascota = nuevo_nombre ;
    }
    get enfermedad(){
        return this._enfermedad;
    }
    set enfermedad(nueva_enfermedad){
        this._enfermedad = nueva_enfermedad ;
    }
}


// se crea una función para mostrar el resultado de acuerdo con el tipo de animal seleccionado por el usuario 
let texto = (mascota) =>{   
//se muestra a modo de lista los mensajes requeridos 
    //se accede a la ul dentro de la div con id resultado en el html
    let resultado = document.querySelector("#resultado ul"); 
    //se crean las 'li's
    let liPropietario = document.createElement("li"); 
    let liMascota = document.createElement("li"); 

    //se agrega el texto a las lis 
    liPropietario.innerHTML = `${mascota.datosPropietario()}`;
    liMascota.innerHTML = `El tipo de animal es un: ${mascota.tipo}, mientras que el nombre de la mascota es: ${mascota.nombre} y el motivo de la consulta o enfermedad es: ${mascota.enfermedad}`;
    
    //se agrega las lis a la ul
    resultado.appendChild(liPropietario);
    resultado.appendChild(liMascota);

//se limpia los dados del formulario
    document.getElementById("propietario").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("nombreMascota").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("enfermedad").value = "";

}

// se crea una función para mostrar el resultado
let Agregar = (event) => {
    event.preventDefault();

// se capta los elementos del formulario con JavaScript
    let dueno = document.getElementById("propietario").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;
    let nombreMascota = document.getElementById("nombreMascota").value;
    let tipo = document.getElementById("tipo").value;
    let motivo = document.getElementById("enfermedad").value;

// se identifica el tipo de animal para realizar la instancia dependiendo del tipo de animal seleccionado
    if(tipo == "perro"){
        let perro = new Mascota (dueno, direccion, telefono, tipo, nombreMascota, motivo);
        return texto(perro);

    } else if(tipo == "gato"){
        let gato = new Mascota (dueno, direccion, telefono, tipo, nombreMascota, motivo);
        return texto(gato);
    } else {
        let conejo = new Mascota (dueno, direccion, telefono, tipo, nombreMascota, motivo);
        return texto(conejo);
    }
}

let boton = document.querySelector("button");
boton.addEventListener("click", Agregar);