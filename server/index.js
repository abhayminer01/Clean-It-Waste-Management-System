require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDatabase = require('./configs/database');

const app = express();

app.use(cors({
    origin : ['http://localhost:5173'],
    credentials : true
}));

app.use(session({
    secret : process.env.SESSION_SECRET,
    saveUninitialized : false,
    resave : false,
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
    connectDatabase();
})