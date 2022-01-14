const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "senhapostgre",
    host: "localhost",
    port: 5432,
    database: "skatepark",
});

const consultarParticipantes = async () => {
    try {
        const result = await pool.query("SELECT * FROM skaters;");
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const registrarParticipante = async (email, nombre, password, anos_experiencia, especialidad) => {
    const consulta = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, estado) VALUES ($1,$2,$3,$4,$5, false) RETURNING *;",
        values: [email, nombre, password, anos_experiencia, especialidad],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const consultarEstado = async (id, estado) => {
    const consulta = {
        text: "UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *;",
        values: [id, estado],
    };
    try {
        const result = await pool.query(consulta);
        const participante = result.rows[0];        
        return participante;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const datosParticipante = async (id) => {
    const consulta = {
        text: `SELECT * FROM skaters WHERE id = $1`,
        values: [id],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return false;
    }
}

//se envia apenas el id y estado en el token, para no enviar junto la contraseña 
const verificarParticipante = async (email, password) => {
    const consulta = {
        text: `SELECT id, estado FROM skaters WHERE email = $1 AND password = $2`,
        values: [email, password],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return false;
    }
}

const editarParticipante = async (id, email, nombre, password, anos_experiencia, especialidad) => {
    const consulta = {
        text: "UPDATE skaters SET email = $2, nombre = $3, password = $4, anos_experiencia = $5, especialidad = $6  WHERE id = $1 RETURNING *;",
        values: [id, email, nombre, password, anos_experiencia, especialidad],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const eliminarParticipante = async (id) => {
    const consulta = {
        text: "DELETE FROM skaters WHERE id = $1",
        values: [id],
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


module.exports = {
    consultarParticipantes,
    registrarParticipante,
    consultarEstado,
    datosParticipante,
    verificarParticipante,
    editarParticipante,
    eliminarParticipante
}