//Utilizar una función async/await para obtener las imágenes correspondientes a los animales.

import animalesData from "./consulta.js";

let animalesImg =
document.getElementById("animal").addEventListener("change", async() => {
    const {animales} = await animalesData;        
    const nombre = document.getElementById("animal").value;
    
    const imgTemplate = animales.find((animal) => animal.name == nombre).imagen;    
    const img = `<img style="display:block; max-width:100%; height:200px; margin:0 auto;" src="./assets/imgs/${imgTemplate}"/>`; 
    document.getElementById("preview").innerHTML = img;    
})

export default animalesImg;