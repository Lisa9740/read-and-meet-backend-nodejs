const {getChats} = require("../data/data");
const {userConnected, userDisconnected} = require("./user.connection.handler");

// get from socket query connected user and then their chats
const handleConnection = (allUsers, connectedUsers, socket) => {
    const query = socket.handshake.query;
    console.log('Connect', query);
    if (query.registrationToken !== undefined) {
        userConnected(allUsers, connectedUsers, query.user, query.registrationToken);

        process.nextTick(async () => {
            socket.emit('allChats', getChats(query.apiToken).data);
        });
    }
}

// disconnect user
const handleDisconnect = (allUsers, connectedUsers, user) => {
    console.log('Disconnect', user);
    userDisconnected(allUsers, connectedUsers, user);
}

module.exports = { handleConnection , handleDisconnect }
