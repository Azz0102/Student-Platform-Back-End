
const dotenv = require("dotenv");
const app = require("./src/app");
const fs = require("fs");

dotenv.config();

const port = process.env.PORT || 3001;

const { createServer } = require("https");
const { createSocketServer } = require("./src/dbs/init.socket");

const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
};

const httpServer = createServer(options, app);

createSocketServer(httpServer);

// Khởi động server trên cổng 3000
httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
