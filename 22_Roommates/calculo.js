const fs = require('fs');

const actualizarCuentas = async () => {
    try {
        const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf-8'));
        const roommates = roommatesJSON.roommates;
        
        const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf-8'));
        const gastos = gastosJSON.gastos;
        //console.log(`gastos ${JSON.stringify(gastos)}`);

        //se aplica el método map() para generar un nuevo arreglo con los montos del historial de gastos
        const arrHistorial = gastos.map((g) => g.monto);
        
        //se verifica que si el arreglo es vazio atribui 0 al monto total del historial de gastos
        let totalHistorial;        
        if (arrHistorial.length == 0) {
            totalHistorial = 0;
          //sino se aplica el método reduce() para somar cada gasto y llegar al monto total   
        } else {
            totalHistorial = arrHistorial.reduce((a, b) => a + b);
        }
        //console.log(`totalHistorial: ${totalHistorial}`);


        for (var i = 0; i < roommates.length; i++) {
            //console.log(`procesando roommate: ${roommatesJSON.roommates[i].nombre}`)
            const arrRoommate = gastos
                //para cada roommate se aplica el método filter() para trabajar el objeto correspondiente a cada uno (datos de cada roommate)
                .filter((g) => {
                    if (g.roommate == roommatesJSON.roommates[i].nombre) {
                        return g
                    }
                })
                //se aplica el método map() para generar un nuevo arreglo con el gasto del roommate
                .map((g) => g.monto)

            //se verifica que si el arreglo es vazio atribui 0 al gasto del roommate. Sino se aplica el método reduce() para somar el total
            let gastoRoommate;            
            if (arrRoommate.length == 0) {
                gastoRoommate = 0;
            } else {
                gastoRoommate = arrRoommate.reduce((a, b) => a + b);
            }
            //console.log((`gasto por roommate: ${JSON.stringify(gastoRoommate)}`));

            //se recalcula y actualiza las cuentas de los roommates
            roommatesJSON.roommates[i].debe = `${((totalHistorial - gastoRoommate) / roommates.length).toFixed(2)}`;
            roommatesJSON.roommates[i].recibe = `${((gastoRoommate / roommates.length) * (roommates.length - 1)).toFixed(2)}`;
            fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON));
        }
    } catch (error) {
        throw error;
    }
}

module.exports = actualizarCuentas;