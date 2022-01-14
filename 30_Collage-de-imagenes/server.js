const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");

// Express con versiones menores a 4.16
//const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Express >= 4.16 - no necesita importar bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//1. se integra express-fileupload a Express
app.use(
    expressFileUpload({
        //2. se define que el límite para la carga de imágenes es de 5MB
        limits: { fileSize: 5000000 },
        abortOnLimit: true,
        //3. se responde con un mensaje indicando que se sobrepasó el límite especificado
        responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
    })
);


app.use(express.static("web"));

//se publica la carpeta 'imagen' en una ruta especifica 'imgs' ocupada en el frontend (url de la imagen) 
app.use('/imgs', express.static(__dirname + '/imagen'));


//se crea una ruta GET / que devuelva el formulario
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/web/formulario.html");
});

//se crea una ruta GET / que devuelva el archivo collage
app.get("/imagen", (req, res) => {
    res.sendFile(__dirname + "/web/collage.html");
});

//4. se crea una ruta POST /imagen que reciba y almacene una imagen en una carpeta pública del servidor
app.post("/imagen", (req, res) => {
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.name = `imagen-${posicion}.jpg`;
    const nombre = target_file.name;    
    target_file.mv(`${__dirname}/imagen/${nombre}`, (error) => {
        error
            ? res.send("Lo siento, ocurrió un error al intentar hacer el upload")
            : res.redirect("/imagen");
    });
});

//5. se crea una ruta GET /deleteImg/:nombre que reciba como parámetro el nombre de una imagen y la elimine de la carpeta en donde están siendo alojadas las imágenes.
//se ocupa get debido a ser un link <a> (frontend está enviando con metodo get na tag <a>)
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/imagen/${nombre}`, (error) => {
        error
            ? res.send("Lo siento, ocurrió un error al intentar eliminar la imagen")
            : res.redirect("/imagen");
    });
});

app.listen(3000, () => console.log("Server on"));
