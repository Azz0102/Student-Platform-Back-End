"use strict";
const io = require("socket.io-client");
global.socket = null;

const NotificationServer = "http://localhost:4000";

const informNS = (user) => {
    global.socket = io.connect(NotificationServer, {
        reconnect: true,
    });

    global.socket.on("connect", function (test) {
        console.log("Connected to Notification Server " + NotificationServer);

        socket.emit("online", user);

        socket.on("message", (msg) => {
            console.log(JSON.stringify(msg));
        });
    });
};

module.exports = {
    informNS,
};
