
const dotenv = require('dotenv');
const app = require('./src/app');

dotenv.config();

const port = process.env.PORT || 3001;
const portSocket = 5000;

const { createServer } = require("http");
const { Server } = require("socket.io");
const { createChat } = require("./src/services/mesage.service");

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('chatMessage', async (mesage, room) => {
        const newChat = await createChat(message);
        io.to(room).emit('chatMessage', mesage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


httpServer.listen(portSocket);

app.listen(port, () => {
    console.log(`Sever is running in port: ${port}`);
})