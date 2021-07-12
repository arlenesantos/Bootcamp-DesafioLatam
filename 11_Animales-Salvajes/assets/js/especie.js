//Crear las clases representadas en el diagrama implementando la herencia indicada
//clases hijas

import Animal from "./animal.js";
import animalesSonido from "./sonido.js";


class Leon extends Animal {
    constructor(nombre, edad, img, comentarios, sonido){
        super(nombre, edad, img, comentarios, sonido);
    }
    rugir(){
        let audio = document.getElementById("player");
        audio.setAttribute('src', this.sonido);
        audio.play();
    }
}

class Lobo extends Animal {
    constructor(nombre, edad, img, comentarios, sonido){
        super(nombre, edad, img, comentarios, sonido);
    }
    aullar(){
        let audio = document.getElementById("player");
        audio.setAttribute('src', this.sonido);
        audio.play();
    }
}

class Oso extends Animal {
    constructor(nombre, edad, img, comentarios, sonido){
        super(nombre, edad, img, comentarios, sonido);
    }
    grunir(){
        let audio = document.getElementById("player");
        audio.setAttribute('src', this.sonido);
        audio.play();
    }
}

class Serpiente extends Animal {
    constructor(nombre, edad, img, comentarios, sonido){
        super(nombre, edad, img, comentarios, sonido);
    }
    sisear(){
        let audio = document.getElementById("player");
        audio.setAttribute('src', this.sonido);
        audio.play();
    }
}

class Aguila extends Animal {
    constructor(nombre, edad, img, comentarios, sonido){
        super(nombre, edad, img, comentarios, sonido);
    }
    chillar(){
        let audio = document.getElementById("player");
        audio.setAttribute('src', this.sonido);
        audio.play();
    }
}

export { Leon, Lobo, Oso, Serpiente, Aguila };