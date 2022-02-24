const { addUser } = require("../helpers/misc");
const {ApiQueries} = require("../helpers/api_queries");
const defaultApp = require("../helpers/firebase.params");

module.exports = (app, io, db) => {

    let allUsers = [];
    let connectedUsers = [];


    io.on("connection", function (socket) {
        handleConnection(socket);

        socket.on("startUniqueChat", ({receiver, sender}, callback) => {
            console.log('startUniqueChat ' + {receiver, sender} + "..");
            addUser(receiver, sender, socket);
        });

        socket.on("joinTwoUsers", ({chatID}) => {
            console.log("joined room " + chatID)
            socket.join(chatID);
        });

        socket.on('load_user_chats', (chatId) => {
            console.log('load_user_chats ... ')
            ApiQueries.getMessages(socket.handshake.query.apiToken, chatId).then((messages => {
                messages = messages.data;
                if (messages.length > 0) {
                    console.log('loadUniqueChat ... ')
                    // console.log(messages)
                    socket.emit("loadUniqueChat", messages);
                }
            }))
        });

        socket.on("sendToUser", async (data) => {
            await sendMessagesToOfflineUsers(data);
        });
    })


    io.on("disconnect", function (socket) {
        handleDisconnect(socket)
    })

    function getChats(token) {
        var chats = []
        ApiQueries.getChats(token).then(listChat => {
            chats = listChat;
        });

        return chats;
    }

    function userConnected(userName, registrationToken) {
        let user = {userName: userName, registrationToken: registrationToken};
        const filteredUsers = allUsers.filter(u => u.userName === userName);
        if (filteredUsers.length === 0) {
            allUsers.push(user);
        } else {
            user = filteredUsers[0];
            user.registrationToken = registrationToken;
        }
        connectedUsers.push(userName);
        console.log("All Users", allUsers);
        console.log("Connected Users", connectedUsers);
    }

    function handleConnection(socket) {
        const query = socket.handshake.query;
        console.log('Connect', query);
        userConnected(query.user, query.registrationToken);
        process.nextTick(async () => {
            socket.emit('allChats', getChats(query.apiToken).data);
        });
    }

    function handleDisconnect(socket) {
        const query = socket.handshake.query;
        console.log('Disconnect', socket.handshake.query);
        userDisconnected(query.user);
    }

    function userDisconnected(userName) {
        let userIndex = connectedUsers.indexOf(userName);
        connectedUsers.splice(userIndex, 1);
        console.log("All Users", allUsers);
        console.log("Connected Users", connectedUsers);
    }

    async function sendMessagesToOfflineUsers(chat) {
        chat = JSON.parse(chat)
        console.log(chat.message);
        const messagePayload = {
            data: {
                type: "CHAT",
                title: 'chat',
                message: chat.message,
                sender: chat.sender,
                recipient: chat.recipient,
                time: chat.time
            },
            tokens: []
        };

        const userTokens = allUsers.filter(user => !connectedUsers.includes(user)).map(user => {
            return user.registrationToken
        });
        if (userTokens.length === 0) {
            return;
        }
        messagePayload.tokens = userTokens;

        await defaultApp.messaging().sendMulticast(messagePayload);

    }

}
