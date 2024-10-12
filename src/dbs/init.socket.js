"use strict";
const portSocket = 5000;
const { Server } = require("socket.io");


const connectToSocket = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");

        if (!connection) throw new Error("Connection not established");

        const channel = await connection.createChannel();

        return { channel, connection };
    } catch (error) {
        console.error("Error connecting to RabbitMQ", error);
        throw err;
    }
};