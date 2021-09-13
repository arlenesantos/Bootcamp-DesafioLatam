const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fullstack.js.0028@gmail.com',
        pass: 'Edutecno.2021',
    },
})

const enviarCorreo = (nuevo_gasto, correos) => {
    return new Promise(async (res, rej) => {        
        let mailOptions = {
            from: "fullstack.js.0028@gmail.com",
            to: ["fullstack.js.0028@gmail.com"].concat(correos),            
            subject: `Nuevo gasto registrado`,
            html: `<p>Hola a todos,</p>
                <p> Se ha registrado un nuevo gasto: <br>
                Roommate: ${nuevo_gasto.roommate} <br>
                Descripcion: ${nuevo_gasto.descripcion} <br>
                Monto: ${nuevo_gasto.monto} </p>`,
        };

        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                rej(error);
            } else {
                res(data);
            }
        });
    });
}

module.exports = enviarCorreo;

