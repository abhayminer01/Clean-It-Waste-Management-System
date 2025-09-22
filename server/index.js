require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDatabase = require('./configs/database');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({
    origin : ['http://localhost:5173'],
    credentials : true
}));
app.use(express.json());
app.use(session({
    secret : process.env.SESSION_SECRET,
    saveUninitialized : false,
    resave : false,
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));

app.use('/api/auth', authRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
    connectDatabase();
})