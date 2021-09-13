const axios = require("axios");
const nodemailer = require("nodemailer");

//Realizar la petición a la api
const getindicadores = async () => {
    let indicadores
    await axios.get("https://mindicador.cl/api")
        .then((info) => {
            const dolar = info.data.dolar.valor;
            const euro = info.data.euro.valor;
            const uf = info.data.uf.valor;
            const utm = info.data.utm.valor;
            indicadores = `<div>
    <h3>Hola! Los indicadores económicos de hoy son los siguientes:</h3>
        <ul>
            <li>El valor del dolár el día de hoy es: $${dolar} CLP</li>
            <li>El valor del euro el día de hoy es: $${euro} CLP</li>
            <li>El valor de la UF el día de hoy es: $${uf} CLP</li>
            <li>El valor de la UTM el día de hoy es: $${utm} CLP</li>
        </ul>
    </div>`;


        })
        .catch((error) => { console.log(error) })
    return indicadores
};

//Usar el paquete nodemailer para el envío de correos electrónicos
//Crear una función que reciba la lista de correos, asunto y contenido a enviar. Esta función debe retornar una promesa.
const enviar = (to, subject, text) => {
    return new Promise(async (res, rej) => {
        let valores = await getindicadores()
        console.log(`valores: ${valores}`)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fullstack.js.0028@gmail.com',
                pass: 'Edutecno.2021',
            },
        })

        let mailOptions = {
            from: 'fullstack.js.0028@gmail.com',
            to,
            subject,
            html: `${text} <br> ${valores}`,
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                rej(err);
            } else {
                res(valores);
            }
        })
    })
}

module.exports = enviar


