const express = require("express");
const connectDB = require("./config/connectDB");
const routes = require("./routes");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const { runProducer } = require("./message_queue/rabbitmq/producerDLX");

require("dotenv").config();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());
const path = require("path");

// Cấu hình thư mục views và template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/view/serverRunning.html"));
});

// Connect to DB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// runProducer();

routes(app);

// handling error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const resMessage = `${error.status} - ${Date.now() - error.now
        }ms - Response: ${JSON.stringify(error)}`;

    // myLogger.error(resMessage, [
    //     req.path,
    //     { requestId: req.requestId },
    //     { message: error.message },
    // ]);
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
