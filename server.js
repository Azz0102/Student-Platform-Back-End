
const dotenv = require('dotenv');
const app = require('./src/app');
const db = require("./src/models");

const https = require('https');
const fs = require('fs');
const path = require('path');

dotenv.config();

const port = process.env.PORT || 3001;
const portSocket = 5000;

const { createServer } = require("https");
const { Server } = require("socket.io");
const { createChat } = require("./src/services/mesage.service");
const { BadRequestError } = require('./src/core/error.response');

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};


const httpServer = createServer(options, app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
    maxHttpBufferSize: 1e7,

});



io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (room) => {
        console.log("joined");
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('chatMessage', async (message, room) => {

        console.log(room);
        try {
            const newChat = await createChat(message);

            console.log({ ...newChat });

            io.to(room).emit('chatMessage', { ...newChat });
        } catch (error) {
            socket.emit("Error create message");
        }
    });

    socket.on('fileMessage', async (data, room) => {
        console.log(`File received: ${data.fileName} of type ${data.fileType}`);

        // Kiểm tra loại tệp
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (allowedTypes.includes(data.fileType)) {
            console.log(typeof (data.fileName));

            const { fileName, fileType, message, enrollmentId, timestamp } = data;

            const enrollment = await db.Enrollment.findByPk(
                enrollmentId
            )

            const folderPath = path.join("C:/Users/phamd/Videos/uploads", enrollment.classSessionId);

            // Tạo thư mục nếu chưa tồn tại
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const filePath = path.join(folderPath, fileName);

            // Tạo buffer từ Base64 string
            const buffer = Buffer.from(message, 'base64');

            // Lưu file vào hệ thống file
            fs.writeFile(filePath, buffer, (err) => {
                console.log("err");
            });

            const newChat = await createChat({ message: filePath, enrollmentId, timestamp, file: true });

            // Gửi tệp tới phòng
            io.to(room).emit('fileReceived', { newChat });


        } else {
            console.log('File type not allowed.');
            socket.emit('fileError', 'File type not allowed.'); // Thông báo lỗi cho người gửi
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


httpServer.listen(portSocket);

// app.listen(port, () => {
//     console.log(`Sever is running in port: ${port}`);
// })

https.createServer(options, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});