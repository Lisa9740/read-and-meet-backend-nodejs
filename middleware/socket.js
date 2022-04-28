const {Api} = require("../helpers/api.queries");

const {sendNotificationToUsers} = require("../helpers/handlers/chat.notification.handler");
const {handleConnection, handleDisconnect} = require("../helpers/handlers/connection.handler");
const {selectUser} = require("../helpers/handlers/user.connection.handler");
const {getMessages} = require("../helpers/data/data");

module.exports = (app, io) => {
    let allUsers = [];
    let connectedUsers = [];

    io.on("connection", function (socket) {

        handleConnection(allUsers, connectedUsers, socket);

        socket.on("startUniqueChat", ({receiver, sender}) => {
            console.log('startUniqueChat ' + {receiver, sender} + "..");

            selectUser(receiver, sender, socket).then(chats =>{
                if (chats.length > 0) {
                    socket.emit("openChat", {...chats[0]});
                }
            }).catch(e => {
                console.log(e)
            });

        });


        socket.on('loadUserMessages', (chatId) => {
            console.log("joined room " + chatId)
            socket.join(chatId);
            console.log('loading user messages... ')
            getMessages(socket, chatId)
        });


        socket.on("sendToUser", async (data) => {
           data = JSON.parse(data);
           console.log(data);

           await sendNotificationToUsers(socket, allUsers, connectedUsers, data);
        });

         socket.on("disconnectUser", async function (socket) {
            handleDisconnect(allUsers, connectedUsers, socket)
        })
    })
}
