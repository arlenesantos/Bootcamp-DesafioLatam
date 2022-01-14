const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

let carrito = [];

app.engine(
    "hbs",
    exphbs({
        extname: '.hbs',
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views/componentes",
    })
);

app.set("view engine", "hbs");

// 5. Consumir los códigos fuentes de Bootstrap y jQuery a través de rutas o middlewares creados en el servidor. 
//Estas dependencias deben ser instaladas con NPM.

app.use(express.static('./assets'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));



//1. Crear una ruta raíz que al ser consultada renderice una vista con un parcial “Dashboard” enviándole en el render un arreglo con los nombres de los productos. Se recomienda que estos coincidan con las imágenes de cada producto.
app.get("/", (req, res) => {
    res.render("main", { 
        layout: "main",        
        productos: [
            "banana",
            "cebollas",
            "pimenton",
            "papas",
            "lechuga",
            "tomate",
        ],
        usuario: "Maria José",  
        //usuario: false,
        ventas: carrito,
        
    });
});

//ruta para levantar modal con compras
app.get("/:producto", (req, res) => {
    const { producto } = req.params;
    if(producto !== "favicon.ico"){
        carrito.push(producto);   
    };    
    res.redirect("/");
});


app.listen(3000, () => console.log("Server on"));

