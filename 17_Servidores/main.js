//1 - Crear un servidor en Node con el módulo http
const http = require('http');
const url = require('url');
const fs = require('fs');

http
    .createServer(function (req, res){
        //se agrega esa línea para considerar los acentos (utf-8)
        res.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});

        const params = url.parse(req.url, true).query;
        const archivo = params.archivo;
        const contenido = params.contenido;
        const nombre = params.nombre;
        const nuevoNombre = params.nuevoNombre;
    
        //2- ruta para crear un archivo
        if(req.url.includes('/crear')){
            //requerimiento opcional 7
            let agregarFecha = () => {
                let hoy = new Date();
                                   
                let dia = hoy.getDate();
                let mes = hoy.getMonth() + 1;
                let ano = hoy.getFullYear();
    
                if(dia || mes < 10){
                    return contenido_nuevo = `${dia}/0${mes}/${ano} <br> ${contenido}`;
                }else{
                    return contenido_nuevo = `${dia}/${mes}/${ano} <br> ${contenido}`;
                }
            };    
            agregarFecha();
            

            fs.writeFile(archivo, contenido_nuevo, 'utf-8', (err) => {
                if(err){
                    //6(crear) - devolver un mensaje de éxito o fracaso en cada consulta recibida
                    res.write('Se produjo un error, inténtalo de nuevo.');
                } else {
                    res.write('Archivo creado con éxito!');
                    res.end();  
                };                
            })
        };

        //3- ruta para devolver el contenido de un archivo
        if(req.url.includes('/leer')){
            fs.readFile(archivo, (err, data) => {
                //6(leer) - devolver un mensaje de éxito o fracaso en cada consulta recibida
                if(err){
                    res.write('Se produjo un error, inténtalo de nuevo.');
                } else {
                    res.write(data);
                    res.end();
                };
            })
        };

        //4- ruta para renombrar un archivo
        if(req.url.includes('/renombrar')){
            fs.rename(nombre, nuevoNombre, (err, data) => {
                //6(renombrar) - devolver un mensaje de éxito o fracaso en cada consulta recibida
                if(err){
                    res.write('Se produjo un error, inténtalo de nuevo.');
                } else {
                    //requerimiento opcional 8
                    res.write(`El archivo ${nombre} fue renombrado por ${nuevoNombre}`);
                    res.end();
                };
            })
        };        

        // 5- ruta para eliminar un archivo y requerimiento opcional 9
        if(req.url.includes('/eliminar')){           
            res.write(`Tu solicitud para eliminar el archivo ${archivo} se está procesando... <br>`);
            setTimeout(() => {                          
                fs.unlink(archivo, (err, data) => {
                    //6(eliminar) - devolver un mensaje de éxito o fracaso en cada consulta recibida  
                    if(err){
                        res.write('Se produjo un error, inténtalo de nuevo.');
                    } else {              
                        res.write(`Archivo ${archivo} eliminado con éxito`);          
                        res.end(); 
                    };                                  
                })
            }, 3000) 
            
        };


    })
    .listen(8080, () => console.log('Escuchando el puerto 8080'));
