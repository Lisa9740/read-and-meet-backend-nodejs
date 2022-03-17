const {setMessagePayloadData, getConnectedUserToken, cleanArrayFromUndefinedValue} = require("../misc/misc");
const defaultApp = require("../../config/firebase.params");


// send by FCM notification to receiver message user
const sendNotificationToUsers = async (token, allUsers, connectedUsers, chat) => {
    try {

        let notification = await setNotificationUserInfo(token.handshake.query.apiToken, connectedUsers, chat);
        await defaultApp.messaging().sendMulticast(notification);
    } catch (ex) {
        console.log(JSON.stringify(ex));
    }
}

// set message payload data needed to get a notification
const setNotificationUserInfo = async  (token, connectedUsers, chat) => {
    const messagePayload = setMessagePayloadData(chat);

    const userTokens = Api.getDevices(token).then(allUsers => { getConnectedUserToken(allUsers, connectedUsers, chat)});

    if (userTokens.length === 0) { return; }

    messagePayload.tokens = cleanArrayFromUndefinedValue(userTokens);
    return messagePayload;
}

module.exports = { sendNotificationToUsers }
