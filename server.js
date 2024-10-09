
const dotenv = require('dotenv');
const app = require('./src/app');

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
        const { avatar, ...newMessage } = message;
        try {
            const newChat = await createChat(newMessage);

            io.to(room).emit('chatMessage', { avatar, ...newChat });
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

            const { avatar, fileName, fileType, ...newMessage } = data;

            const newChat = await createChat({ ...newMessage, file: true });

            // Gửi tệp tới phòng
            io.to(room).emit('fileReceived', { newChat });

            const { message } = data;

            // Tạo buffer từ Base64 string
            const buffer = Buffer.from(message, 'base64');

            // Đường dẫn để lưu file
            const filePath = path.join("C:/Users/phamd/Videos/uploads", fileName);


            // Lưu file vào hệ thống file
            fs.writeFile(filePath, buffer, (err) => {
                console.log("err");
            });



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