const {Api} = require("../api.queries");

const userConnected = (allUsers, connectedUsers, userInfo, registrationToken) => {
    let user = {userName: userInfo, registrationToken: registrationToken};

    const filteredUsers = allUsers.filter(u => u.userName === userInfo);

    if (filteredUsers.length === 0) {
        allUsers.push(user);
    } else {
        user = filteredUsers[0];
        user.registrationToken = registrationToken;
    }

    connectedUsers.push(userInfo);

    console.log("All Users", allUsers);
    console.log("Connected Users", connectedUsers);
}

const userDisconnected = (allUsers, connectedUsers, userName) => {
    let userIndex = connectedUsers.indexOf(userName);
    connectedUsers.splice(userIndex, 1);
    console.log("All Users", allUsers);
    console.log("Connected Users", connectedUsers);
}

const selectUser = async (receiverId, senderId, socket) => {
    if (!receiverId || !senderId) {
        return {error: "You tried to add zero users"};
    } else {
        console.log("select chats user ...");
        return Api.getChats(socket.handshake.query.apiToken);
    }
}


module.exports = { userConnected, userDisconnected, selectUser }
