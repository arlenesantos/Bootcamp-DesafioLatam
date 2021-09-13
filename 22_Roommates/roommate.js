const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const nuevoRoommate = async () => {
    try {
        const data = await axios.get('https://randomuser.me/api');
        const user = data.data.results[0];        
        const roommate = {
            id: uuidv4().slice(30),
            nombre: `${user.name.first} ${user.name.last}`,
            email: user.email,
            debe: 0,
            recibe: 0,
        }
        //console.log(roommate);
        return roommate;

    } catch (error) {
        throw error;
    }
}

const guardarRoommate = async (roommate) => {
    const roommateJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf-8'));
    roommateJSON.roommates.push(roommate);
    //console.log(JSON.stringify(roommateJSON));
    fs.writeFileSync('roommates.json', JSON.stringify(roommateJSON));
}

module.exports = { nuevoRoommate, guardarRoommate };


