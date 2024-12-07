const express = require("express");
const connectDB = require("./config/connectDB");
const routes = require("./routes");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const { runProducer } = require("./message_queue/rabbitmq/producerDLX");
const multer = require("multer");

require("dotenv").config();

app.use(express.json({ limit: '10mb' }));

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: "*",
        exposedHeaders: ["Content-Disposition", "Cache-Control"], // Cho phép client truy cập header này
    })
);
const path = require("path");

// Cấu hình thư mục views và template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve the file uploads directory
app.use(
    "/uploads",
    (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    },
    express.static(path.join(`${process.env.SAVE_PATH}`, "uploads"), {
        setHeaders: (res) => {
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
            res.set("Cache-Control", "no-store"); // or "no-cache" for development
        },
    })
);

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
