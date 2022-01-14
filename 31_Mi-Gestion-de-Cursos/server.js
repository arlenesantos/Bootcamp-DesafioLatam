const express = require("express");
const app = express();

const { agregarCurso, getCurso, editarCurso, eliminarCurso } = require("./consultas");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => console.log("Server ON"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 1. Crear una ruta POST /curso que reciba un payload desde el cliente con los datos de
// un nuevo curso y los ingrese a la tabla cursos.

app.post("/curso", async (req, res) => {
  try {
    const { nombre, nivelTecnico, fechaInicio, duracion } = req.body;
    const respuesta = await agregarCurso(nombre, nivelTecnico, fechaInicio, duracion);
    res.status(200).type("json").send(respuesta);
  } catch (e) {
    console.log(e);
    res.status(500).type("json").send({
      error: "Ha ocurrido un error al registrar un curso",
    });
  }
});

// 2. Crear una ruta GET /cursos que consulte y devuelva los registros almacenados en la
// tabla cursos.

app.get("/cursos", async (req, res) => {
  try {
    const respuesta = await getCurso();
    res.status(200).type("json").send(respuesta);
  } catch (e) {
    console.log(e);
    res.status(500).type("json").send({
      error: "Ha ocurrido un error al obtener los cursos",
    });
  }
});

// 3. Crear una ruta PUT /curso que reciba un payload desde el cliente con los datos de un
// curso ya existente y actualice su registro en la tabla cursos.

app.put("/curso", async (req, res) => {
  try {
    const { id, nombre, nivelTecnico, fechaInicio, duracion } = req.body;
    const respuesta = await editarCurso(id, nombre, nivelTecnico, fechaInicio, duracion);
    res.status(200).type("json").send(respuesta);
  } catch (e) {
    console.log(e);
    res.status(500).type("json").send({
      error: "Ha ocurrido un error al obtener los cursos",
    });
  }
});

// 4. Crear una ruta DELETE /cursos que reciba el id de un curso como parámetro de la
// ruta y elimine el registro relacionado en la tabla cursos.

app.delete("/cursos/:curso", async (req, res) => {
  try {
    const { curso } = req.params;
    const respuesta = await eliminarCurso(curso);
    if (respuesta > 0) {
      res.status(200).type("json").send(`El curso de id ${curso} fue eliminado con éxito`);
    } else {
      res.status(200).type("json").send("No existe un curso con ese id");
    }
  } catch (e) {
    console.log(e);
    res.status(500).type("json").send({
      error: "Ha ocurrido un error al obtener los cursos",
    });
  }
});
