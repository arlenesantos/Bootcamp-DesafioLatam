const { Pool } = require("pg");

const config = {
    user: "postgres",
    password: "senhapostgre",
    host: "localhost",
    port: 5432,
    database: "repertorio",
}

const pool = new Pool(config);

//1. se crea una función asíncrona para inserir datos en la tabla repertorio
const insertar = async (datos) => {
    const query = {
        text: "INSERT INTO repertorio (cancion, artista, tono) VALUES ($1, $2, $3);",
        values: datos,
    };    
    try {
        const result = await pool.query(query);
        return result
    } catch (error) {  
        console.log(error);
        return error;
    }    
};

//2. se crea una función asíncrona para consultar los datos de la tabla repertorio
const consultar = async () => {    
    try {
        const result = await pool.query("SELECT id, cancion, artista, tono FROM repertorio;");
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }    
};

//3. se crea una función asíncrona para editar datos en la tabla repertorio
const editar = async (datos) => {       
    const query = {
        text: `UPDATE repertorio SET cancion = $1, artista = $2, tono = $3 WHERE id = $4;`,
        values: datos,
    };  
    try {
        const result = await pool.query(query); 
        return result;       
    } catch (error) {
        console.log(error);
        return error;        
    }   
};

//4. se crea una función asíncrona para eliminar datos de la tabla repertorio
const eliminar = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM repertorio WHERE id = ${id};`);  
        return result;      
    } catch (error) {
        console.log(error); 
        return error;       
    }    
};

module.exports = { insertar, consultar, editar, eliminar };


