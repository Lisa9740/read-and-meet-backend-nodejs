const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = socketio(server).sockets;

// * BorderParser Middleware
app.use(express.json());

// * Load Env
dotenv.config({ path: "./config.env" });

// * Connect DB
const db = require('./config/database.js');

//* Log route actions
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/** Chatroom routes */
require("./middleware/socket")(app, io, db);

const port = process.env.PORT || 6000;


server.listen(port, () => console.log(`Server started on port ${port}`));
