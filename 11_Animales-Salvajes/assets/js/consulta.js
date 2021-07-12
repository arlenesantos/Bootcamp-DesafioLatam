//Utilizar una función autoejecutable IIFE

let animalesData = (async () => {
    const respuesta = await fetch("/animales.json");
    const datos = await respuesta.json(); 
    return datos;
    
})();

export default animalesData;