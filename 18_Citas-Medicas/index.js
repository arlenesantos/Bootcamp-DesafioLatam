//Servidor
const http = require('http');
const url = require('url');
//Requerimiento 1
const axios = require('axios');
const urlApi = 'https://randomuser.me/api/?results=7';
//Requerimiento 2
const { v4: uuidv4 } = require('uuid');
//Requerimiento 3
const moment = require('moment');
//Requierimiento 4
const _ = require('lodash');
//Requerimiento 5
const chalk = require('chalk');


http
    .createServer((req, resp) => {
        resp.writeHeader(200, { "Content-Type": "text/html; charset=utf-8" });
        const params = url.parse(req.url, true).query;

        if (req.url.includes('/registrados')) {
            
            axios
                .get(urlApi)
                .then((res) => {
                    let ID = uuidv4().slice(0, 6);
                    let fecha = moment().format('MMMM Do YYYY, h:mm:ss a');
                    let data = res.data.results;
                    
                    _.map(data, (item, i) => {
                        resp.write(`\n ${i+1}. Nombre: ${item.name.first} - Apellido: ${item.name.last} - ID: ${ID} - Timestamp: ${fecha}`);
                    })

                    _.map(data, (item) => {
                        console.log(chalk.blue.bgWhite(`Nombre: ${item.name.first} - Apellido: ${item.name.last} - ID: ${ID} - Timestamp: ${fecha}`));
                    })
                    
                    resp.end();
                })
                .catch((error) => {
                    console.log(error);
                });
        }; 
    })
    .listen(8080, () => console.log('puerto 8080'));




