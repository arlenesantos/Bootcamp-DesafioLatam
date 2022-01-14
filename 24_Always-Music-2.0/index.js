//se recibe los argumentos por línea de comando 
const yargs = require('yargs');
const args = yargs.argv._;

/* argumentos:
comando = args[0];
rut = args[1];
nombre = args[2];
curso = args[3];
nivel = args[4];
*/

//Ocupar la clase Pool definiendo sus diferentes propiedades:
const { Pool } = require('pg');
const config = {
    user: 'postgres',
    password: 'senhapostgre',
    host: 'localhost',
    port: 5432,
    database: 'escuela',
    max: 20,
    min: 2,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
};


const pool = new Pool(config);
pool.connect(async (error_connection, client, release) => {
    //Retornar por consola un mensaje de error en caso de haber problemas de conexión:
    if (error_connection) return console.error('Problema de conexión: ', error_connection.code);

    try {
        switch (args[0]) {
            case 'registrar':
                await registrar(client, args[1], args[2], args[3], args[4]);
                //Liberar a un cliente al concluir su consulta
                release();
                break;
            case 'consultarEstudiantes':
                await consultarEstudiantes(client);
                release();
                break;
            case 'consultarRut':
                await consultarRut(client, args[1]);
                release();
                break;
            case 'actualizar':
                await actualizar(client, args[1], args[2], args[3], args[4]);
                release();
                break;
            case 'eliminar':
                await eliminar(client, args[1]);
                release();
                break;
            default:
                console.log(`Ingrese un comando válido`);
        }

    } catch (error) {
        console.log(error);
    };
    pool.end();
});

//Agregar un nuevo estudiante:
let registrar = async (client, rut, nombre, curso, nivel) => {
    try {
        const sqlRegistrar = {
            text:
                "INSERT INTO estudiante (rut, nombre, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *;",
            values: [rut, nombre, curso, nivel],
        };
        let res = await client.query(sqlRegistrar);
        console.log('Ultimo registro agregado: ', res.rows[0]);        
    } catch (error) {
        console.log(error);        
    }    
};

//Consultar los estudiantes registrados:
let consultarEstudiantes = async (client) => {
    try {
        const sqlRegistrados = {
            //Prepared Statement
            name: 'registros',
            //Obtener los estudiantes registrados en formato de arreglos
            rowMode: "array",
            text: "SELECT rut, nombre, curso, nivel FROM estudiante;",
        };
        let res = await client.query(sqlRegistrados);
        console.log('Estudiantes registrados: ', res.rows);        
    } catch (error) {
        console.log(error);         
    }    
};

//Consultar estudiante por rut:
let consultarRut = async (client, rut) => {
    try {
        const sqlConsultarRut = {
            //Prepared Statement
            name: 'consultaRut',
            text: `SELECT rut, nombre, curso, nivel FROM estudiante WHERE rut = $1;`,
            values: [rut],
        };
        let res = await client.query(sqlConsultarRut);
        //validación: rowCount verifica cuantas filas fueron afectadas
        if (res.rowCount > 0) {            
            console.log(`Estudiante consultado: `, res.rows[0]);
        } else {
            console.log(`Estudiante con rut = ${rut} no existe.`);
        } 
    } catch (error) {
        console.log(error);        
    }    
};

//Actualizar la información de un estudiante:
let actualizar = async (client, rut, nombre, curso, nivel) => {
    try {
        const sqlActualizar = {
            text: `UPDATE estudiante SET nombre = $2,  curso = $3, nivel = $4 WHERE rut = $1 RETURNING *;`,
            values: [rut, nombre, curso, nivel],
        };
        let res = await client.query(sqlActualizar); 
        //validación
        if (res.rowCount > 0) {
            console.log(`Estudiante con rut = ${rut} editado con éxito.`);
            console.log('Registro actualizado: ', res.rows[0]); 
        } else {
            console.log(`Estudiante con rut = ${rut} no existe.`);
        }
    } catch (error) {
        console.log(error);        
    }    
};

//Eliminar el registro de un estudiante:
let eliminar = async (client, rut) => {
    try {
        const sqlEliminar = {
            text: `DELETE FROM estudiante WHERE rut = $1 RETURNING *;`,
            values: [rut],
        };
        let res = await client.query(sqlEliminar); 
        //validación
        if (res.rowCount > 0) {
            console.log(`Estudiante con rut = ${rut} eliminado con éxito.`);
            console.log('Registro eliminado: ', res.rows[0]);
        } else {
            console.log(`Estudiante con rut = ${rut} no existe.`);
        } 
    } catch (error) {
        console.log(error);
    }    
};


//testes por linea de comando:

//node index.js registrar '23.517.854-4' 'Maria Jose' 'piano' 2
//node index.js consultarEstudiantes 

//node index.js consultarRut '23.517.854-4'
//node index.js consultarRut '23.517.85-4' -- validación

//node index.js actualizar 'Maria Jose' '23.517.854-4'  'piano' 4 -- validación
//node index.js actualizar '23.517.854-4' 'Maria Jose' 'piano' 4

//node index.js eliminar '23.517.854-4'
//node index.js eliminar '23.517.854-4' -- validación


