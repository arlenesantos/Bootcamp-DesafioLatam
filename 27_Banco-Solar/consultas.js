//conectar una base de datos PostgreSQL con Node

const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "senhapostgre",
    host: "localhost",
    port: 5432,
    database: "bancosolar",
    max: 20,
    min: 2,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
});


//usuarios:

const registrarUsuario = async (data) => {
    const query = {
        text: "INSERT INTO usuario (nombre, balance) VALUES ($1, $2) RETURNING *;",
        values: data,
    };
    try {
        result = await pool.query(query);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const consultarUsuarios = async () => {
    try {
        result = await pool.query("SELECT id, nombre, balance FROM usuario;");
        return result.rows;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const editarUsuario = async (data, id) => {
    const query = {
        text: `UPDATE usuario SET nombre = $1, balance = $2 WHERE id = ${id} RETURNING *;`,
        values: data,
    };
    try {
        result = await pool.query(query);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const eliminarUsuario = async (id) => {

    /*se verifica si el usuario a eliminar tiene transferencias sea como emisor o receptor.
    En caso afirmativo, se elimina el registro de la transación para en seguida eliminar el usuario (foreign key constraint).
    En caso negativo, se elimina el usuario sin afectar la tabla de transferencias.*/


    const validacionEmisor = {
        text: ` SELECT t.emisor, u.nombre
                FROM transferencia as t 
                INNER JOIN usuario as u ON t.emisor = u.id 
                WHERE u.id = $1;`,
        values: [id],
    };

    const validacionReceptor = {
        text: ` SELECT t.receptor, u.nombre
                FROM transferencia as t 
                INNER JOIN usuario as u ON t.receptor = u.id 
                WHERE u.id = $1;`,
        values: [id],
    };

    const query = {
        text: `DELETE FROM usuario WHERE id = $1 RETURNING *;`,
        values: [id],
    };

    try {

        const resultEmisor = await pool.query(validacionEmisor); 
        const resultReceptor = await pool.query(validacionReceptor);    
      
        if (resultEmisor.rowCount > 0) {
            const eliminarTransacion = {
                text: `DELETE FROM transferencia WHERE emisor = $1 RETURNING *;`,
                values: [id],
            };
            await pool.query(eliminarTransacion);            
        }; 
        
        if (resultReceptor.rowCount > 0) {
            const eliminarTransacion = {
                text: `DELETE FROM transferencia WHERE receptor = $1 RETURNING *;`,
                values: [id],
            };
            await pool.query(eliminarTransacion);            
        };

        const eliminarUsuario = await pool.query(query);
        return eliminarUsuario;

    } catch (error) {
        console.log(error);
        return error;
    }
};


//transferencias:
// Con transacciones y cursores se ocupa pool.connect y client.query

const transferir = async (data) => {

    const client = await pool.connect();

    //se crea la fecha actual
    data.push(new Date());


    const registrarTransferencia = {
        text: "INSERT INTO transferencia (emisor, receptor, monto, fecha) values ( $1, $2, $3, $4) ",
        values: data,
    };

    const descontarBalance = {
        text: "UPDATE usuario SET balance = balance - $1 WHERE id = $2",
        values: [Number(data[2]), data[0]], // data = [id-emisor, id-receptor, monto, fecha]
    };

    const acreditarBalance = {
        text: "UPDATE usuario SET balance = balance + $1 WHERE id = $2",
        values: [Number(data[2]), data[1]],
    };

    let result;
    try {
        await client.query("BEGIN");
        await client.query(registrarTransferencia);
        await client.query(descontarBalance);
        await client.query(acreditarBalance);
        await client.query("COMMIT");
        result = true;
    } catch (error) {
        await client.query("ROLLBACK");
        console.log("Ocurrió un error: " + error);
        result = false;
    } finally {
        client.release();
        return result;
    }
};

//Devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo
const consultarTransferencias = async () => {
    const query = {
        rowMode: "array",
        text: `
            SELECT t.id, u1.nombre, u2.nombre, t.monto, t.fecha 
            FROM transferencia as t 
            INNER JOIN usuario as u1 ON t.emisor = u1.id 
            INNER JOIN usuario as u2 ON t.receptor = u2.id;
        `
    };
    try {
        result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.log(error);
        return error;
    }
};


module.exports = {
    registrarUsuario,
    consultarUsuarios,
    editarUsuario,
    eliminarUsuario,
    transferir,
    consultarTransferencias,
};
