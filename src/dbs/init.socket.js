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
            console.log(typeof room);
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
                io.to(room.toString()).emit(
                    "chatMessaged",
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
            console.log(
                `File received: ${data.fileName} of type ${data.fileType}`
            );

            // Kiểm tra loại tệp
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];

            if (allowedTypes.includes(data.fileType)) {
                console.log(typeof data.fileName);

                const { fileName, fileType, message, enrollmentId, timestamp } =
                    data;

                const enrollment = await db.Enrollment.findByPk(enrollmentId, {
                    include: [{ model: db.User, attributes: ["id", "name"] }],
                });

                if (!enrollment || !enrollment.User) {
                    throw new Error("User not found for the given enrollment");
                }

                const folderPath = path.join(
                    process.env.SAVE_PATH,
                    enrollment.classSessionId.toString()
                );

                // Tạo thư mục nếu chưa tồn tại
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                const filePath = path.join(folderPath, fileName);

                // Tạo buffer từ Base64 string
                const buffer = Buffer.from(message, "base64");

                // Lưu file vào hệ thống file
                fs.writeFile(filePath, buffer, (err) => {
                    console.log("err");
                });

                const newChat = await createChat({
                    message: filePath,
                    enrollmentId,
                    timestamp,
                    file: true,
                });

                // Gửi tệp tới phòng
                io.to(room.toString()).emit(
                    "fileReceived",
                    {
                        id: newChat.id,
                        message: filePath,
                        timestamp: newChat.timestamp,
                        file: newChat.file,
                        enrollmentId,
                        usedId: enrollment.User.id,
                        name: enrollment.User.name,
                    },
                    room
                );
            } else {
                console.log("File type not allowed.");
                socket.emit("fileError", "File type not allowed."); // Thông báo lỗi cho người gửi
            }
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
