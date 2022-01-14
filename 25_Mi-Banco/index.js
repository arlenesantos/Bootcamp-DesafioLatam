
const { Pool } = require("pg");
const Cursor = require("pg-cursor");
const yargs = require('yargs');

const args = yargs.argv._;

const config = {
    user: "postgres",
    password: "senhapostgre",
    host: "localhost",
    database: "banco",
    port: 5432,
    max: 20,
    min: 2,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

pool.connect(async (error_connection, client, release) => {
    if (error_connection) return console.log(error_connection);
    await client.query("BEGIN");

    try {        
        switch (args[0]) {            
            case "acreditar":                
                await acreditar(client, args[3], args[4]);               
                break;
            case "descontar":
                await descontar(client, args[3], args[4]);
                break;            
            case "consultarTransacciones":
                await consultarTransacciones(client, args[1]);
                break;
            case "consultarSaldo":
                await consultarSaldo(client, args[1]);
                break;
            default:
                console.log("Ingrese un comando válido");                
        };
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error);
    };

    release();
    pool.end();
});

//se crea una función asíncrona para una transacción de acreditación
let acreditar = async (client, monto, id) => {
    try {
        const acreditar = `UPDATE cuentas SET saldo = saldo + ${monto} WHERE id = ${id} RETURNING *;`;
        const acreditacion = await client.query(acreditar);
        console.log("Acreditación realizada con éxito: ", acreditacion.rows[0]);
        //se registra la transacción
        await registrarTransaccion(client, args[1], args[2], args[3], args[4]);
    } catch (error) {
        console.log(error);
    }
}

//se crea una función asíncrona para una transacción de descuento
let descontar = async (client, monto, id) => {
    try {
        const descontar = `UPDATE cuentas SET saldo = saldo - ${monto} WHERE id = ${id} RETURNING *;`;        
        const descuento = await client.query(descontar);
        console.log("Descuento realizado con éxito: ", descuento.rows[0]);
        //se registra la transacción
        await registrarTransaccion(client, args[1], args[2], args[3], args[4]);
    } catch (error) {
        console.log(error);
    }
}

//se crea una función asíncrona que registre la nueva transacción
let registrarTransaccion = async (client, descripcion, fecha, monto, cuenta) => {
    try {
        const query = `INSERT INTO transacciones (descripcion, fecha, monto, cuenta) VALUES ('${descripcion}', '${fecha}', ${monto}, ${cuenta}) RETURNING *;`;         
        const transaccion = await client.query(query);
        console.log("Transaccion realizada con éxito: ", transaccion.rows[0]);
    } catch (error) {
        console.log(error);
    }
}

//se crea una función asíncrona que consulte la tabla de transacciones y retorne máximo 10 registros de una cuenta en específico 
let consultarTransacciones = async (client, cuenta) => {
    try {
        const query = `SELECT * FROM transacciones WHERE cuenta = ${cuenta}`; 
        const consulta = new Cursor(query);
        const cursor = client.query(consulta);

        cursor.read(10, (err, rows) => {
            console.log(rows);
            cursor.close();
        });
    } catch (error) {
        console.log(error);
    }
}

//se crea una función asíncrona que consulte el saldo de una cuenta
let consultarSaldo = async (client, id) => {
    try {
        const query = `SELECT saldo FROM cuentas WHERE id = ${id}`;        
        const consulta = new Cursor(query);
        const cursor = client.query(consulta);

        cursor.read(1, (err, rows) => {
            console.log(rows);
            cursor.close();
        });
    } catch (error) {
        console.log(error);
    }
}


//testes por linea de comando:
// node index.js acreditar acreditacion '25-09-2021' 25000 1 
// node index.js descontar descuento '25-09-2021' 10000 1

// ingresar más de 10 transacciones para seguir con el próximo paso

// node index.js consultarTransacciones 1
// node index.js consultarSaldo 1


