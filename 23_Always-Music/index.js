
//se recibe por línea de comando los argumentos
const yargs = require('yargs');
const args = yargs.argv._;

/* argumentos:
comando = args[0];
rut = args[1];
nombre = args[2];
curso = args[3];
nivel = args[4];
*/

//se realiza la conexión con PostgreSQL con la clase Client
const { Client } = require('pg');

const config = {
    user: 'postgres',
    password: 'senhapostgre',
    host: 'localhost',
    port: 5432,
    database: 'escuela',
}

const client = new Client(config);
client.connect();

//función para registrar un nuevo estudiante
let registrar = async (rut, nombre, curso, nivel) => {
    const res = await client.query(
        `INSERT INTO estudiante (rut, nombre, curso, nivel) VALUES ('${rut}', '${nombre}', '${curso}', ${nivel}) RETURNING *;`
    )
    //console.log(`Registro agregado: ${JSON.stringify(res.rows)}`);
    console.log(`Estudiante ${nombre} agregado con éxito`);
    client.end();
}

//función para consultar el registro de un estudiante por medio de su rut
let consultarRut = async (rut) => {
    const res = await client.query(
        `SELECT rut, nombre, curso, nivel FROM estudiante WHERE rut = '${rut}';`
    )
    console.log(`Consulta por rut: ${JSON.stringify(res.rows)}`);
    client.end();
}

//función para consultar todos los estudiantes registrados
let consultarTodos = async () => {
    const res = await client.query(
        `SELECT * FROM estudiante;`
    )
    console.log(`Registros: ${JSON.stringify(res.rows)}`);
    client.end();
}

//función para actualizar los datos de un estudiante
let editar = async (rut, nombre, curso, nivel) => {
    const res = await client.query(
        `UPDATE estudiante SET nombre = '${nombre}',  curso = '${curso}', nivel = '${nivel}' WHERE rut = '${rut}' RETURNING *;`
    )
    //console.log(`Editado: ${JSON.stringify(res.rows)}`);
    console.log(`Estudiante ${nombre} editado con éxito`);
    client.end();
}

//función para eliminar el registro de un estudiante (condición - rut)
let eliminar = async (rut) => {
    const res = await client.query(
        `DELETE FROM estudiante WHERE rut = '${rut}' RETURNING *;`
    )
    console.log(`Registro de estudiante con rut ${rut} eliminado`);
    client.end();
}


switch (args[0]) {
    case 'registrar':
        registrar(args[1], args[2], args[3], args[4]);
        break;
    case 'consultarRut':
        consultarRut(args[1]);
        break;
    case 'consultarTodos':
        consultarTodos();
        break;
    case 'editar':
        editar(args[1], args[2], args[3], args[4]);
        break;
    case 'eliminar':
        eliminar(args[1]);
        break;
    default:
        console.log(`Ingrese un comando válido`);        
}


//testes por linea de comando:
//node index.js registrar '12.345.678-9' 'Brian May' 'guitarra' 7
//node index.js registrar '98.765.432-1' 'Mary Lee' 'piano' 2
//node index.js consultarTodos
//node index.js consultarRut '98.765.432-1'
//node index.js editar '12.345.678-9' 'Brian May' 'guitarra' 10
//node index.js eliminar '98.765.432-1'
//node index.js consultarTodos




