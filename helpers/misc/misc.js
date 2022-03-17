
// set payload format input for message notification
const setMessagePayloadData = (chat) => {
    console.log("setting message payload ...");
    return {
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
}


// filter from all users the connected user which is receiving message to getting their registering token
const getConnectedUserToken = (allUsers, connectedUsers, chat) => {
    console.log("test", allUsers);
    console.log("chat", chat);
    return allUsers.filter(user => connectedUsers.includes(user.registration_token)).map(user => {

        if (chat.recipientId.toString() === user.id){
            return user.registrationToken
        }
    });
}


const cleanArrayFromUndefinedValue = (array) => {
    return array.filter(function(x) {
        return x !== undefined;
    });
}


module.exports = { setMessagePayloadData, getConnectedUserToken, cleanArrayFromUndefinedValue }
