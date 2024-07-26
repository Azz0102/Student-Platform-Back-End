const express = require("express");
const connectDB = require("./config/connectDB");
const routes = require("./routes");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

require("dotenv").config();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());

// Connect to DB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

routes(app);

// handling error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const resMessage = `${error.status} - ${
        Date.now() - error.now
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
