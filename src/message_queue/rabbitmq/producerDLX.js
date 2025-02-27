const amqp = require("amqplib");

const messages = "hello, RabbitMQ for ITicetea";

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        const notificationExchange = "notificationEx"; //  notificationEx direct

        const notiQueue = "notificationQueueProcess"; // assertQueue
        const notificationExchangeDLX = "notificationExDLX";
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

        // 1. create Exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        });

        // 2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // allow many connections to queue
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // 4. Send message
        const msg = "a new product";
        console.log("producer msg::", msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000",
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(`error:`, error);
    }
};

module.exports = {
    runProducer,
};

// runProducer().catch(console.error);
