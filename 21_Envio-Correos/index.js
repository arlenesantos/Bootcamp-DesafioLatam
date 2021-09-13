const enviar = require("./correos");
const archivo = require("./archivo");
const http = require("http");
const fs = require("fs");
const url = require("url");

http
    .createServer(async (req, res) => {
        if (req.url == "/") {
            fs.readFile("index.html", (err, dato) => {
                res.end(dato)
            })
        }

        if (req.url.includes("/mailing")) {
            let params = url.parse(req.url, true).query
            let correos = params.correos
            let asunto = params.asunto
            let contenido = params.contenido

            let respuesta = await enviar(correos, asunto, contenido)
            if (respuesta) {
                archivo(contenido + respuesta, res)
            }
            else {
                //Enviar un mensaje de error
                console.log("error al enviar los correos") 
            }
        }
    })
    .listen(3000, () => console.log("servidor onn"))