const http = require("http");
const url = require("url");
const fs = require("fs");
const { registrarUsuario, consultarUsuarios, editarUsuario, eliminarUsuario, transferir, consultarTransferencias } = require("./consultas");

http.createServer(async (req, res) => {
    //devuelve la aplicación cliente disponible en el apoyo de la prueba    
    if (req.url == "/" && req.method === "GET") {
        fs.readFile("index.html", (error, html) => {            
            if(error) {
                res.statusCode = 500;
                res.end();
            } else {
                res.setHeader("content-type", "text/html");
                res.statusCode = 200;
                res.end(html);
            }           
        });
    };
   

    //usuarios

    //recibe los datos de un nuevo usuario y los almacena en PostgreSQL
    if (req.url == "/usuario" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {            
            try {
                const data = Object.values(JSON.parse(body));
                const result = await registrarUsuario(data);
                res.statusCode = 201;
                res.end(JSON.stringify(result));  
            } catch (error) {
                res.statusCode = 500;
                res.end("Ocurrió un problema en el servidor " + error);                
            }            
        });
    };    
    

    //devuelve todos los usuarios registrados con sus balances
    if (req.url == "/usuarios" && req.method === "GET") {
        try {
            const result = await consultarUsuarios();
            res.statusCode = 200;
            res.end(JSON.stringify(result));
        } catch (error) {
            res.statusCode = 500;
            res.end("Ocurrió un problema en el servidor " + error);
        }        
    };

    //recibe los datos modificados de un usuario registrado y los actualiza
    if (req.url.startsWith("/usuario?") && req.method === "PUT") {
        const { id } = url.parse(req.url, true).query;
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {            
            try {
                const data = Object.values(JSON.parse(body));
                const result = await editarUsuario(data, id);
                res.statusCode = 200;
                res.end(JSON.stringify(result));  
            } catch (error) {
                res.statusCode = 500;
                res.end("Ocurrió un problema en el servidor " + error);                
            }          
        });
    };

    //recibe el id de un usuario registrado y lo elimina
    if (req.url.startsWith("/usuario?") && req.method === "DELETE") {
        try {
            const { id } = url.parse(req.url, true).query;
            await eliminarUsuario(id);
            res.statusCode = 200;            
            res.end();
            
        } catch (error) {
            res.statusCode = 500;
            res.end("Ocurrió un problema en el servidor " + error);            
        }        
    };

    //transferencias


    //recibe los datos para realizar una nueva transferencia
    if (req.url == "/transferencia" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {            
            try {
                const data = Object.values(JSON.parse(body));
                const result = await transferir(data);
                res.statusCode = 201;
                res.end(JSON.stringify(result));            
            } catch (error) {
                res.statusCode = 500;
                res.end("Ocurrió un problema en el servidor " + error);                 
            }
        });
    };

    //devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo
    if (req.url == "/transferencias" && req.method === "GET") {
        try {
            const result = await consultarTransferencias();
            res.statusCode = 200;
            res.end(JSON.stringify(result));
        } catch (error) {
            res.statusCode = 500;
            res.end("Ocurrió un problema en el servidor " + error);            
        }        
    };

}).listen(3000, () => console.log("Server on"));
