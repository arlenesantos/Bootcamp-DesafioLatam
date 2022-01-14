const PoolSingleton = require("./poolbd");
const pool = PoolSingleton.getInstance();

const agregarCurso = async (nombre, nivel, fecha, duracion) => {
  const consulta = {
    text: "INSERT INTO cursos (nombre, nivel, fecha, duracion) values ($1,$2,$3,$4) RETURNING *;",
    values: [nombre, nivel, fecha, duracion],
  };
  try {
    const result = await pool.query(consulta);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getCurso = async () => {
  try {
    //se usa la función "to_char" para convertir la fecha en un string 
    const result = await pool.query("SELECT id, nombre, nivel,  to_char(fecha,'DD-MM-YYYY') as fecha,  duracion FROM cursos ORDER BY id");
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const editarCurso = async (id, nombre, nivel, fecha, duracion) => {
  const consulta = {
    text: "UPDATE cursos SET nombre = $2, nivel = $3, fecha = $4, duracion = $5 WHERE id = $1 RETURNING *;",
    values: [id, nombre, nivel, fecha, duracion],
  };
  try {
    const result = await pool.query(consulta);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const eliminarCurso = async (id) => {
  const consulta = {
    text: "DELETE FROM cursos WHERE id = $1",
    values: [id],
  };
  try {
    const result = await pool.query(consulta);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  agregarCurso,
  getCurso,
  editarCurso,
  eliminarCurso,
};
