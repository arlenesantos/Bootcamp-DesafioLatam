//Utilizar una función async/await para obtener los sonidos correspondientes a los animales

import animalesData from "./consulta.js";

let animalesSonido =
document.getElementById("animal").addEventListener("change", async() => {
    const {animales} = await animalesData;        
    const nombre = document.getElementById("animal").value;   
    const audio = document.getElementById("player");

    const animalSonido = animales.find((animal) => animal.name == nombre).sonido; 
    audio.setAttribute('src', `./assets/sounds/${animalSonido}`);    
})

export default animalesSonido;