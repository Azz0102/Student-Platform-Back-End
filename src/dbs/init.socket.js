"use strict";
const portSocket = 5000;
const { Server } = require("socket.io");
const db = require("../models");
const { createChat } = require("../services/mesage.service");
const fs = require("fs");
const path = require("path");

let io;
function createSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
        maxHttpBufferSize: 1e7,
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("joinRoom", (room) => {
            console.log("joined");
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        socket.on("chatMessage", async (message, room) => {
            console.log(room);
            try {
                const newChat = await createChat(message);

                const enrollment = await db.Enrollment.findByPk(
                    newChat.enrollmentId,
                    {
                        include: [
                            { model: db.User, attributes: ["id", "name"] },
                        ],
                    }
                );

                if (!enrollment || !enrollment.User) {
                    throw new Error("User not found for the given enrollment");
                }

                console.log("aa ", newChat.message);
                io.to(room).emit(
                    "chatMessage",
                    {
                        id: newChat.id,
                        message: newChat.message,
                        timestamp: newChat.timestamp,
                        file: newChat.file,
                        enrollmentId: message.enrollmentId,
                        usedId: enrollment.User.id,
                        name: enrollment.User.name,
                    },
                    room
                );
            } catch (error) {
                socket.emit("Error create message");
            }
        });

        socket.on("fileMessage", async (data, room) => {
            // ... (rest of the fileMessage event handler)
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized. Please call initializeSocket first."
        );
    }
    return io;
}
function pushNoti(newNoti, notiUser) {
    const ioInstance = getIO();
    ioInstance.emit("NewsNoti", { newNoti, notiUser });
    return newNoti;
}

module.exports = { createSocketServer, pushNoti };
