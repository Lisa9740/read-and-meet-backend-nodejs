const {setMessagePayloadData, getConnectedUserToken, cleanArrayFromUndefinedValue} = require("../misc/misc");
const defaultApp = require("../../config/firebase.params");
const {Api} = require("../api.queries");


// send by FCM notification to receiver message user
const sendNotificationToUsers = async (socket, allUsers, connectedUsers, chat) => {
    try {

        console.log("api", socket.handshake.query.apiToken);
        let notification = Api.getDevices(socket.handshake.query.apiToken).then(async allUsers => {
            await setNotificationUserInfo(allUsers.data, connectedUsers, chat);
        });
        console.log(notification);
        await defaultApp.messaging().sendMulticast(notification);
    } catch (ex) {
        console.log(JSON.stringify(ex));
    }
}

// set message payload data needed to get a notification
const setNotificationUserInfo = async  (allUsers, connectedUsers, chat) => {
    const messagePayload = setMessagePayloadData(chat);
    console.log("notif",  allUsers, connectedUsers);
    const userTokens = await  getConnectedUserToken(allUsers, connectedUsers, chat);


    if (userTokens.length === 0) { return; }


    messagePayload.tokens = cleanArrayFromUndefinedValue(userTokens);
    return messagePayload;
}

module.exports = { sendNotificationToUsers }
