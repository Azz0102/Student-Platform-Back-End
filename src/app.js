const express = require('express');
const connectDB = require('./config/connectDB');
const routes = require('./routes');
const cors = require('cors');


const app = express();
connectDB();
app.use(cors());

// Connect to DB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

module.exports = app;