
// 1 - recibir por la línea de comando los argumentos
const argumento = process.argv.slice(2);
let nombre_archivo = argumento[0];
let extension_archivo = argumento[1];
let moneda_a_convertir = argumento[2];
let cantidad_pesos = Number(argumento[3]);

/*
nombre_archivo = 'cotizacion';
extension_archivo = 'txt';
moneda_a_convertir = 'dolar';
cantidad_pesos = 250000;
*/


// 2 - consultar la API con el módulo https y almacenar la respuesta en una variable
const https = require('https');

https
    .get('https://mindicador.cl/api', (resp) => {
        let dataApi = "";

        resp.on('data', (data) => {
            dataApi += data;
        });

        resp.on('end', () => {
            //console.log(JSON.parse(dataApi));

            let jsonApi = JSON.parse(dataApi);


            // 3 - crear un archivo con el módulo fs
            //console.log(jsonApi['dolar']);
            
            let contenido = 
            `A la fecha: ${jsonApi['fecha']} \n
            Fue realizada cotización con los siguientes datos: \n
            Cantidad de pesos a convertir: ${cantidad_pesos} pesos \n
            Convertido a "${moneda_a_convertir}" da un total de: \n
            $ ${Number(cantidad_pesos) / Number(jsonApi[moneda_a_convertir]['valor'])}`

          
            const fs = require('fs');

            fs.writeFile(`${nombre_archivo}.${extension_archivo}`, contenido, 'utf8', () => { console.log(contenido)});
            
        });


    })
    
    .on('error', (e) => {
        console.error(e);
    });