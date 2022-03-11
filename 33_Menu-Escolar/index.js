//express
const express = require("express");
const app = express();

//handlebars
const { engine } = require('express-handlebars');

//session
var session = require('express-session');

//PostgreSQL queries
const { isAdmin, isSchool, newSchool, filterOrder,  newOrder, allOrders, getOrder, rectify, allOrdersAdmin, getSchools,  saveNews, latestNews } = require("./query");


//integrations:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine(
    "hbs",
    engine({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/main`,        
        extname: "hbs",
    })
);
app.set("view engine", "hbs");

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

//public directories
app.use('/css', express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/js', express.static(__dirname + "/node_modules/bootstrap/dist/js"));


//routes
app.get("/login", async (req, res) => {
    try {
        res.render("login", {layout: false});
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 });
    }
});

//register new school:
app.post("/login", async (req, res) => {
    try {
        let { login, emailLogin, passwordLogin, register, name, school, email, password, passwordConfirm } = req.body;
        
        if(login){
            let admin = await isAdmin(emailLogin, passwordLogin);
            let liceo = await isSchool(emailLogin, passwordLogin);

            if (admin) {
            req.session.logged_in = true;
            req.session.admin = admin;            
            req.session.save(); 
            res.redirect('/'); 
                
            } else if (liceo) {
                req.session.logged_in = true;
                req.session.school = liceo;            
                req.session.save(); 
                res.redirect('/'); 
            } else {
                res.redirect('/login');
            }
        }

        if (register){
            if(password === passwordConfirm){
                let new_school = await newSchool(name, school, email, password);
                req.session.logged_in = true;
                req.session.school = new_school;            
                req.session.save(); 
                res.redirect('/'); 
            } else {
                res.status(500).send({code: 500, message: "password does not match"});
            }
                 
        }
        
    } catch (error) {
        console.log(error);

    }
});

//logout
app.get("/logout", async (req, res) => {
    try {
        req.session.logged_in = false;
        req.session.admin = false;
        req.session.school = false;            
        req.session.save();        
        res.redirect('/');
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 })
    }
})

app.get("/", async (req, res) => {   

    try{
        if(req.session.logged_in){            
            if(req.session.admin){
                let admin = req.session.admin;
                let news = await latestNews();
                let schools = await getSchools();
                let orders;                
                
                if(req.url.includes("/?")){                    
                    let { school, initialDate, untilDate } = req.query;                    
                    orders = await filterOrder(school, initialDate, untilDate);

                } else {
                    orders = await allOrdersAdmin();  
                }

                res.render("admin-home", { logged: req.session.logged_in, admin: admin, news: news,  schools: schools, orders: orders}); 

            } else if (req.session.school) {                
                let school = req.session.school; 
                let orders = await allOrders(school.id);  
                res.render('home', {logged: req.session.logged_in , school: school, orders: orders});
            }
             
         } else {
             res.redirect('/login');
         } 
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 })
    }

});

app.post("/", async (req, res) => {
    try {
        let { title, content } = req.body;       
        await saveNews(title, content);
        res.redirect("/");  

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 });
    }
});


app.get("/orders", async (req, res) => {
    try {
        let { id } = req.query;       
        let order = await getOrder(id);         
        res.render("detalle", { order: order });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 });
    }
});

app.get("/orders/new", async (req, res) => {
    try {  
        let school = req.session.school;                    
        res.render("pedido", {school: school});
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 });
    }
});

app.post("/orders/new", async (req, res) => {
    try {
        let { date, school_id, vegetariano, celiacos, estandar, calorico, autoctono } = req.body;        
        await newOrder(date, school_id, vegetariano, celiacos, estandar, calorico, autoctono);
        res.redirect("/");

    } catch (error) {
        console.log(error);        
        res.status(500).send({ error: error, code: 500 });
    }
});


app.get("/orders/rectify", async (req, res) => {
    try {
        let { id } = req.query;
        let order = await getOrder(id);        
        res.render("rectificacion", { order: order });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 });
    }
});

app.post("/orders/rectify", async (req, res) => {
    try {
        let { id, observaciones, vegetariano, celiacos, estandar, calorico, autoctono } = req.body;
        await rectify(id, observaciones, vegetariano, celiacos, estandar, calorico, autoctono);
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, code: 500 });
    }
});

app.listen(3000, () => console.log("server on"));







