
const http = require('http');
const url = require('url');
const fs = require('fs');
const axios = require('axios');


http
    .createServer((req, res) => {       

        if (req.url == '/pokemones') {
            let promesaPkm = [];
            let pokemones = [];

            res.writeHead(200, { 'Content-Type': 'application/json'});

            let getPokemones = async () => {                
                const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
                return data.results;
            }

            let getData = async (nombre) => {
                const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
                return data;
            }

            getPokemones().then((resultado) => {
                resultado.forEach((p) => {
                    let nombrePkm = p.name;
                    promesaPkm.push(getData(nombrePkm));
                });


                Promise.all(promesaPkm).then((resultado) => {
                    resultado.forEach((p) => {
                        let img = p.sprites.front_default;
                        let nombre = p.name;
                        //console.log({ 'img': img, 'nombre': nombre });
                        pokemones.push({ 'img': img, 'nombre': nombre });
                    })
                    //console.log(`pokemones: ${pokemones}`);

                    // corrige problema de CORS - 'Access-Control-Allow-Origin': '*'
                    //res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    
                    res.write(JSON.stringify(pokemones));
                    res.end();
                })
            })

        }

        if (req.url == '/galeria') {
            res.writeHead(200, { 'Content-Type': 'text/html' });            
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html);
            })
        }


    })
    .listen(3000, () => console.log('Servidor encendido'));




