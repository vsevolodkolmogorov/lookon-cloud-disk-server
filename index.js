require('dotenv').config();
const express = require('express')
const sequelize = require('./db')
const modules = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/indexRouter')
const errorHandler = require('./middleware/errorMiddlewareHandling')
const path = require("path");
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 5000

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);

// Обработка ошибок
app.use(errorHandler)

const start = async  () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server start work on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start()