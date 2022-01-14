//importaciones:

//express
const express = require("express");
const app = express();
//handlebars
const exphbs = require("express-handlebars");
//express-fileupload
const expressFileUpload = require("express-fileupload");
//JWT
const jwt = require('jsonwebtoken');
//consultas en PostgreSQL
const { consultarParticipantes, registrarParticipante, consultarEstado, datosParticipante, verificarParticipante, editarParticipante, eliminarParticipante } = require("./consultas");
//se ocupa UUID para generar la llave secreta
const { v4: uuidv4 } = require('uuid');
const secretKey = uuidv4().slice(30);


//integraciones:

//payload - bodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//carpeta publica y estilo css
app.use(express.static(__dirname + "/assets"));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//handlebars
app.set("view engine", "hbs");
app.engine(
    "hbs",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
        extname: '.hbs',
        helpers: {
            inc: function (value) {
                return parseInt(value) + 1;
            }
        }
    })
);
//express-fileupload
app.use(
    expressFileUpload({
        limits: { fileSize: 5000000 },
        abortOnLimit: true,
        responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
    })
);


//rutas:

//se crea la ruta raiz para mostrar todos los participantes registrados y su estado de revisión
app.get("/", async (req, res) => {
    try {
        const participantes = await consultarParticipantes();
        res.render("index", { participantes });
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta participantes con el metodo GET para permitir actualizar datos o registrar un nuevo participante
app.get("/participantes", async (req, res) => {
    try {
        const { token } = req.query;
        //se utiliza el método verify para verificar el token recibido del cliente
        if (token) {
            jwt.verify(token, secretKey, async (error, payload) => {
                if (error) {
                    res.status(401).send(
                        res.send({
                            error: "401 Unauthorized",
                            message: "Participante no está autorizado para modificar datos",
                            token_error: error.message,
                        })
                    );
                } else {
                    //se crea una función para renderizar los datos completos del participante y permitir que se actualize
                    const participante = await datosParticipante(payload.data.id);
                    res.render("datos", { data: participante });
                }
            });
        } else {
            //en caso de no existir token, se renderiza la vista de registro de un nuevo participante
            res.status(200);
            res.render("registro");
        }
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta participantes con el metodo POST para registrar un nuevo participante
app.post("/participantes", async (req, res) => {
    try {
        const { email, nombre, password, repetirPassword, anos_experiencia, especialidad } = req.body;
        //se verifica si los campos de contraseña son compatibles
        if (password !== repetirPassword) {
            return res.status(400).send("Error al cadastrar password");
        };
        //se verifica si el participante subió una foto
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send("Ningún archivo subido");
        };
        //se agrega la funcionalidad upload-file y se ocupa el email del participante como nombre del archivo para permitir una identificación unica         
        const { foto } = req.files;
        foto.mv(`${__dirname}/assets/images/${email}.jpeg`, async (error) => {
            if (error) return res.status(500).send({
                error: `Algo salió mal... ${error}`,
                code: 500
            })
        });
        await registrarParticipante(email, nombre, password, anos_experiencia, especialidad);
        res.redirect("/login");
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta participantes con el metodo PUT para actualizar un nuevo participante
app.put("/participantes", async (req, res) => {
    const { id, email, nombre, password, repetirPassword, anos_experiencia, especialidad } = req.body;
    try {
        if (password !== repetirPassword) {
            return res.status(400).send("Error al cadastrar password");
        };
        const participante = await editarParticipante(id, email, nombre, password, anos_experiencia, especialidad);
        res.status(201).type("json").send(participante);
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta participantes con el metodo DELETE para eliminar un participante
app.delete("/participantes", async (req, res) => {
    try {
        const { id } = req.body;
        const participante = await eliminarParticipante(id);
        res.status(200).type("json").send(participante);
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta admin con el metodo GET para mostrar los participantes registrados y permitir aprobarlos para cambiar su estado 
app.get("/admin", async (req, res) => {
    try {
        const participantes = await consultarParticipantes();
        res.render("admin", { participantes });
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta admin con el metodo PUT para permitir cambiar el estado de cada participante
app.put("/admin", async (req, res) => {
    try {
        const { id, estado } = req.body;
        const participante = await consultarEstado(id, estado);
        res.status(200).type("json").send(participante);
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se crea la ruta login con el metodo GET para mostrar la vista de login
app.get("/login", (req, res) => {
    try {
        res.render("login");
        res.status(200);
    } catch (error) {
        res.status(500).send({
            error: `Ocurrió un problema en el servidor... ${error}`,
            code: 500
        })
    }
});

//se verifica las credenciales del participante y se crea el token
app.post("/verificacion", async function (req, res) {
    let { email, password } = req.body;
    let participante = await verificarParticipante(email, password);
    if (participante) {
        if (participante.estado) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 120,
                    data: participante,
                },
                secretKey
            );
            res.send(token);
        } else {
            res.status(404).send({
                error: "Este participante aún no ha sido aprobado a modificar datos",
                code: 404,
            });
        }
    } else {
        res.status(404).send({
            error: "Participante o contraseña incorrecto",
            code: 404,
        });
    }
});

app.listen(3000, () => console.log("Server on"));