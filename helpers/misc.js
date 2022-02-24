const {ApiQueries} = require("./api_queries");

const addUser = async (receiverId, senderId, socket) => {
    if (!receiverId || !senderId) {
        return {error: "You tried to add zero users"};
    } else {
        console.log("select chats ...");
        //const user = { receiverId, senderId };
      ApiQueries.getChats(socket.handshake.query.apiToken).then(chats =>{
            if (chats.length > 0) {
                socket.emit("openChat", {...chats[0]});
            }
    }).catch(e => {
          console.log(e)
    })
}}

module.exports = { addUser}
