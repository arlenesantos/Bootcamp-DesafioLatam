const url = require('url');
const http = require('http');
const fs = require('fs');
const { nuevoRoommate, guardarRoommate } = require('./roommate');
const { v4: uuidv4 } = require('uuid');
const actualizarCuentas = require("./calculo");
const enviarCorreo = require("./correos");

http
    .createServer((req, res) => {
        const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf-8'));
        const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf-8'));
        const gastos = gastosJSON.gastos;

        //ruta para devolver el documento HTML disponibilizado en el apoyo
        if (req.url == '/' && req.method == 'GET') {
            try {
                res.setHeader('Content-Type', 'text/html');
                res.end(fs.readFileSync('index.html', 'utf-8'));
            } catch (error) {
                res.statusCode = 500;
                res.end();
                console.log(`Error al devolver documento HTML: ${error}`);
            }
        }

        //ruta para almacenar un nuevo roommate ocupando random user
        if (req.url.startsWith('/roommate') && req.method == 'POST') {
            nuevoRoommate().then(async (data) => {
                guardarRoommate(data).then(async (resultado) => {
                    //se recalcula y actualiza las cuentas de los roommates (rutas con los métodos POST, PUT, DELETE)
                    await actualizarCuentas();
                });
                res.end(JSON.stringify(data));
            }).catch((error) => {
                res.statusCode = 500;
                res.end();
                console.log(`Error al registrar un nuevo roommate: ${error}`);
            });
        }

        //ruta para devolver el historial con todos los gastos registrados
        if (req.url.startsWith('/gastos') && req.method == 'GET') {
            try {
                res.setHeader('Content-Type', 'application/json');
                res.end(fs.readFileSync('gastos.json', 'utf-8'));
            } catch (error) {
                res.statusCode = 500;
                res.end();
                console.log(`Error al devolver el historial de gastos: ${error}`);
            }
        }

        //ruta para recibir el payload con los datos del gasto y almacenarlos en un archivo JSON
        if (req.url.startsWith('/gasto') && req.method == 'POST') {
            try {
                let body;
                req.on('data', (payload) => {
                    body = JSON.parse(payload);
                });
                req.on('end', () => {
                    gasto = {
                        roommate: body.roommate,
                        descripcion: body.descripcion,
                        monto: body.monto,
                        id: uuidv4().slice(30),
                    };
                    gastos.push(gasto);
                    fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
                    actualizarCuentas().then((resultado) => resultado);
                    res.end();

                    //se envia un correo electrónico a todos los roommates cuando se registre un nuevo gasto
                    const correos = roommatesJSON.roommates.map((r) => r.email);
                    enviarCorreo(gasto, correos).then((resultado) => {
                        console.log(`Correos enviados exitosamente`);
                        res.end();
                    }).catch((error) => console.log(`Error al enviar correos: ${error}`));
                })
            } catch (error) {
                res.statusCode = 500;
                res.end();
                console.log(`Error al registrar un nuevo gasto: ${error}`);
            }
        }

        //ruta para editar los datos de un gasto
        if (req.url.startsWith('/gasto') && req.method == 'PUT') {
            try {
                const { id } = url.parse(req.url, true).query;
                let body;
                //console.log(`id ${id}`);

                req.on('data', (payload) => {
                    body = JSON.parse(payload);
                    //los datos del playload no contienen el id del gasto, entonces se agrega el id recibido por la url
                    body.id = id;
                });
                req.on('end', () => {
                    gastosJSON.gastos = gastos.map((g) => {
                        //console.log(`gastos: ${JSON.stringify(gastos)}`)                   
                        if (g.id == body.id) {
                            return body;
                        }
                        return g;
                    });
                    fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
                    actualizarCuentas().then((resultado) => resultado);
                    res.end();
                })

            } catch (error) {
                res.statusCode = 500;
                res.end();
                console.log(`Error al editar los datos de un gasto: ${error}`);
            }
        }

        //ruta para eliminar un gasto del historial
        if (req.url.startsWith('/gasto') && req.method == 'DELETE') {
            try {
                const { id } = url.parse(req.url, true).query;
                gastosJSON.gastos = gastos.filter((g) => g.id !== id);
                fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
                actualizarCuentas().then((resultado) => resultado);
                res.end();
            } catch (error) {
                res.statusCode = 500;
                res.end();
                console.log(`Error al eliminar un gasto del historial: ${error}`);
            }
        }

        //ruta para devolver todos los roommates almacenados en el servidor (roommates.json)
        if (req.url.startsWith('/roommates') && req.method == 'GET') {
            try {
                res.setHeader('Content-Type', 'application/json');
                res.end(fs.readFileSync('roommates.json', 'utf-8'));
            } catch (error) {
                res.statusCode = 500;
                res.end();
                console.log(`Error al devolver todos los roommates: ${error}`);
            }
        }
    }).listen(3000, () => console.log('server on'));

