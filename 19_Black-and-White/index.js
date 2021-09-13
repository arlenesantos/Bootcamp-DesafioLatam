//node index.js acceso -k=123
//florespedia.com/Imagenes/tipos-de-flores.jpg
//https://miviaje.com/wp-content/uploads/2016/05/shutterstock_337174700.jpg


const http = require('http');
const url = require('url');
const fs = require('fs');
const Jimp = require('jimp');
const yargs = require('yargs');

const key = 123;
const argv = yargs
    .command(
        'acceso',
        'Comando para levantar el servidor',
        {
            key: {
                describe: 'Contraseña',
                demand: true,
                alias: 'k',
            },
        },
        (args) => {

            if (args.key == key) {
                //levantar el servidor
                http
                    .createServer((req, res) => {
                        const params = url.parse(req.url, true).query;
                        const urlImg = params.url;
                                             

                        if (req.url.includes('/')) {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            fs.readFile('index.html', 'utf8', (err, html) => {
                                res.end(html)
                            });
                        }

                        if (req.url.includes('/estilos')) {
                            res.writeHead(200, { 'Content-Type': 'text/css' });
                            fs.readFile('estilo.css', (err, css) => {
                                res.end(css)
                            });
                        }

                        if (req.url == '/imagen') {

                            Jimp.read(urlImg, (err, imagen) => {
                                imagen
                                    .resize(350, Jimp.AUTO)
                                    .grayscale()
                                    .quality(60)
                                    .writeAsync('newImg.jpg')
                                    .then(() => {
                                        fs.readFile('newImg.jpg', (err, Imagen) => {
                                            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                                            console.log('flores');
                                            res.end(Imagen);
                                        })
                                    })
                            })
                        }
                    })
                    .listen(8080, () => console.log('Escuchando puerto 8080', process.pid));
            } else {
                console.log('Credenciales incorrectas');
            }
        }
    )
    .help().argv