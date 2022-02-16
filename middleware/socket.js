const { addUser } = require("../helpers/misc");
const Messages = require("../schema/Messages");

module.exports = (app, io, db) => {
  io.on("connection", function (socket) {
    // "6YDAM1LVauUWTnQoAAAC",
     socket.on("_getUser", ({id}) => {
         var user = [];
         db.query("SELECT * FROM `users` WHERE id=" + id +";", { type: db.QueryTypes.SELECT }).then((usersData => {
             user = usersData;
         }))
    });

    //* Unique chat *//
    socket.on("startUniqueChat",  ({receiver, sender}, callback) => {
        console.log('startUniqueChat ' + {receiver, sender} + "..");
        addUser(receiver, sender, socket);
      }
    );

     socket.on("joinTwoUsers", ({ chatID }) => {
         console.log("joined room " + chatID)
        socket.join(chatID);
      });

      socket.on('load_user_chats', (chatId) => {
          console.log('load_user_chats ... ')
          db.query("SELECT * FROM `messages` WHERE `chat_id` = " + chatId + ";", { type: db.QueryTypes.SELECT }).then((messages => {
              console.log(messages);
          if (messages.length > 0) {
              console.log('loadUniqueChat ... ')
              console.log(messages)
              socket.emit("loadUniqueChat", messages);
          }
        }))
      });


      socket.on("sendTouser", (data) => {
       socket.broadcast.to(data.roomID).emit("dispatchMsg", { ...data });

       const {
         _id,
         roomID,
         senderEmail,
         receiverEmail,
         time,
         txtMsg
       } = data;

       new Messages({
         _id,
         roomID,
         senderEmail,
         receiverEmail,
         time,
         txtMsg,
       }).save();

   });
  })
}
