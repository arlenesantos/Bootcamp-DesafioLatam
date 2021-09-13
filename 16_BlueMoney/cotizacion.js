//5 - ejecutar la aplicación desde un archivo externo con el módulo child_process

const child_process = require('child_process');

const argumento = process.argv.slice(2);
let nombre_archivo = argumento[0];
let extension_archivo = argumento[1];
let moneda_a_convertir = argumento[2];
let cantidad_pesos = Number(argumento[3]);


function ejecutar(archivo) {
    
    return new Promise((resolve) => {
        //4 - enviar por consola el contenido del archivo luego de que haya sido creado - primer parametro de exec
        child_process.exec(`node ${archivo} ${nombre_archivo} ${extension_archivo} ${moneda_a_convertir} ${cantidad_pesos}`, function (err, result) {
            resolve(result)
        })
    })
}


ejecutar('desafio.js').then((resultado) => {
    console.log(resultado);
})


/*
nombre_archivo = 'cotizacion';
extension_archivo = 'txt';
moneda_a_convertir = 'dolar';
cantidad_pesos = 250000;
*/