const http = require("http");
const url = require("url");
const fs = require("fs");

const { insertar, consultar, editar, eliminar } = require("./consultas");


http.createServer(async (req, res) => {
    if(req.url == "/" && req.method === "GET"){
        res.setHeader("content-type", "text/html");
        res.end(fs.readFileSync("index.html", "utf-8"));
    };

    //1. se crea una ruta POST /cancion que reciba los datos de una canción que se desea inserir
    if(req.url == "/cancion" && req.method === "POST"){
        //recibir la data enviada desde el cliente
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            //Al terminar de recibir la data del cliente, utiliza el Object.values() para almacenar en una constante un arreglo con los valores del objeto body
            const datos = Object.values(JSON.parse(body));
            
            //Guardar en una constante la respuesta de la ejecución de la función asíncrona “insertar” pasándole como argumento el arreglo generado en el paso anterior
            const respuesta = await insertar(datos);
            //Devolver al cliente un JSON con el objeto de respuesta creado en el paso anterior
            res.end(JSON.stringify(respuesta)); 
        })
    }

    //2. se crea una ruta GET /canciones que devuelva un JSON con los registros de la tabla repertorio
    if(req.url == "/canciones" && req.method === "GET"){        
        const respuesta = await consultar();
        //para ocupar foreach en index.html es necesario enviar la respuesta en formato de arreglo, para ello se ocupa respuesta.rows 
        res.end(JSON.stringify(respuesta.rows));
    }

    //3. se crea una ruta PUT /cancion que reciba los datos de una canción que se desea editar
    if(req.url == "/cancion" && req.method === "PUT"){                         
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {            
            const datos = Object.values(JSON.parse(body));
            const respuesta = await editar(datos);            
            res.end(JSON.stringify(respuesta)); 
        })
    }

    //4. se crea una ruta DELETE /cancion que reciba por queryString el id de una canción que se desea eliminar
    if(req.url.startsWith("/cancion?") && req.method === "DELETE"){
        const { id } = url.parse(req.url, true).query;
        const respuesta = await eliminar(id);            
        res.end(JSON.stringify(respuesta));        
    }

}).listen(3000, () => console.log("Server on"));