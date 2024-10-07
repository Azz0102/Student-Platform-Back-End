
const dotenv = require('dotenv');
const app = require('./src/app');

const https = require('https');
const fs = require('fs');

dotenv.config();

const port = process.env.PORT || 3001;
const portSocket = 5000;

const { createServer } = require("https");
const { Server } = require("socket.io");
const { createChat } = require("./src/services/mesage.service");

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};


const httpServer = createServer(options, app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (room) => {
        console.log("joined");
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('chatMessage', async (mesage, room) => {

        console.log(room);
        // const newChat = await createChat(message);
        io.to(room).emit('chatMessage', mesage);
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