const {Api} = require("../api.queries");

const getChats = (token) => {
    let chats = [];
    Api.getChats(token).then(listChat => {
        chats = listChat;
    });
    return chats;
}

const getMessages = (socket, chatId) => {
    Api.getMessages(socket.handshake.query.apiToken, chatId).then((messages => {
        messages = messages.data;
        if (messages.length > 0) {
            console.log('emitting messages ... ')
            socket.emit("loadUniqueChat", messages);
        }
    }))
}


module.exports = {  getChats, getMessages }
