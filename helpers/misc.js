//const Chats = require("../schema/Chats");
const { v4: uuidV4 } = require("uuid");
const db = require('../config/database.js');


const addUser = async (receiverId, senderId, socket) => {
    if (!receiverId || !senderId) {
        return {error: "You tried to add zero users"};
    } else {
        console.log("select chats ...");
        //const user = { receiverId, senderId };
      await  db.query("SELECT * FROM `chats` WHERE `participant_one` = " + senderId + " AND `participant_two` = " + receiverId + ";", {type: db.QueryTypes.SELECT}).then(chats =>{
            if (chats.length > 0) {
                socket.emit("openChat", {...chats[0]});
            }
    }).catch(e => {
          console.log(e)
    })
}}

module.exports = { addUser}
