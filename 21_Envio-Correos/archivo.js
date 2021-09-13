
//Enviar un mensaje de éxito o error por cada intento de envío de correos electrónicos.
//Cada correo debe ser almacenado como un archivo con un nombre identificador único en una carpeta “correos”. Usar el paquete UUID para esto.

const { v4: uuidv4 } = require('uuid');
const fs = require ("fs");

const archivo = (contenido, res)=>{
    let dire = "./correos/"+ uuidv4()
    fs.writeFile (dire, contenido, "utf-8", (err, data)=> {
        err ? console.log(err) : res.write("correos enviados")
        res.end()
    })
}

module.exports= archivo