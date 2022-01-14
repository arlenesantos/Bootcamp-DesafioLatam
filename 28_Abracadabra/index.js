//se crea un servidor con Express en el puerto 3000
const express = require('express');
const app = express();

//se crea en el servidor un arreglo de nombres
const usuarios = [
    "Juan", 
    "Jocelyn",
    "Astrid",
    "Maria",
    "Ignacia",
    "Javier",
    "Brian"
]

//se define la carpeta “assets” como carpeta pública del servidor
app.use(express.static("assets"));

//se devuelve el arreglo de usuarios en formato JSON a través de la ruta /abracadabra/usuarios
app.get("/abracadabra/usuarios", (req, res) => {
    const registros = { usuarios };  
    res.send(JSON.stringify(registros));    
});

//se crea un middleware para validar que el usuario recibido como parámetro “usuario” existe en el arreglo de nombres creado en el servidor
app.use("/abracadabra/juego/:usuario", (req, res, next) => {
    const nombreUsuario = req.params.usuario;
    const isUser = usuarios
        .map((u) => u.toLowerCase())
        .includes(nombreUsuario.toLowerCase());
    isUser ? next() : res.sendFile(__dirname + "/assets/who.jpeg");
});

//ruta GET correspondiente:
app.get("/abracadabra/juego/:usuario", (req, res, next) => {      
    res.sendFile(__dirname + '/index.html');  
});

//se crea una ruta que valide si el parámetro “n” coincide con el número generado de forma aleatoria
app.get("/abracadabra/conejo/:n", (req, res) => {
    const num = Math.floor(Math.random() * (5 - 1)) + 1;
    //console.log(num);
    const n = req.params.n;

    if(num == n){
        //en caso de ser exitoso, devolver la imagen del conejo
        res.sendFile(__dirname + '/assets/conejito.jpg');
    } else {
        //de lo contrario devolver la imagen de Voldemort
        res.sendFile(__dirname + '/assets/voldemort.jpg');
    }
});

//se crea una ruta genérica al consultar una ruta que no esté definida en el servidor
app.get("*", (req, res) => {
    res.send("<center><h1>Esta página no existe...</h1> </center>");
});

app.listen(3000, () => console.log("server on"));