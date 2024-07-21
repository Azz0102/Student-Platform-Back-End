
const dotenv = require('dotenv');
const app = require('./src/app');

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Sever is running in port: ${port}`);
})