const dotenv = require("dotenv");
const app = require("./src/app");
const db = require("./src/models");

const https = require("https");
const fs = require("fs");
const path = require("path");

dotenv.config();

const port = process.env.PORT || 3001;
const portSocket = 5000;

const { createServer } = require("https");
const { Server } = require("socket.io");
const { createChat } = require("./src/services/mesage.service");
const { BadRequestError } = require("./src/core/error.response");

const options = {
    key: fs.readFileSync("./localhost+2-key.pem"),
    cert: fs.readFileSync("./localhost+2.pem"),
};

const httpServer = createServer(options, app);

const io = new Server(httpServer, {
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

            // Fetch the user data associated with the enrollmentId (this will depend on your app structure)
            const enrollment = await db.Enrollment.findByPk(
                newChat.enrollmentId,
                {
                    include: [{ model: db.User, attributes: ["id", "name"] }],
                }
            );

            if (!enrollment || !enrollment.User) {
                throw new Error("User not found for the given enrollment");
            }

            console.log("aa ", newChat.message);
            io.to(room).emit("chatMessage", {
                id: newChat.id,
                message: newChat.message,
                timestamp: newChat.timestamp,
                file: newChat.file,
                enrollmentId: message.enrollmentId,
                usedId: enrollment.User.id,
                name: enrollment.User.name,
            });
        } catch (error) {
            socket.emit("Error create message");
        }
    });

    socket.on("fileMessage", async (data, room) => {
        console.log(`File received: ${data.fileName} of type ${data.fileType}`);

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
                "/home/huy/Documents/File",
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
            io.to(room).emit("fileReceived", {
                id: newChat.id,
                message: filePath,
                timestamp: newChat.timestamp,
                file: newChat.file,
                enrollmentId,
                usedId: enrollment.User.id,
                name: enrollment.User.name,
            });
        } else {
            console.log("File type not allowed.");
            socket.emit("fileError", "File type not allowed."); // Thông báo lỗi cho người gửi
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const pushNoti = (newNoti) => {
    io.emit("NewsNoti", newNoti);
    return newNoti;
};

httpServer.listen(portSocket);

// app.listen(port, () => {
//     console.log(`Sever is running in port: ${port}`);
// })

https.createServer(options, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});

// Export the io instance so it can be used in other files
module.exports = { pushNoti };
