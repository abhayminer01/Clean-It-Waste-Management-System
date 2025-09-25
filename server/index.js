require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDatabase = require('./configs/database');

const authRoutes = require('./routes/auth.routes');
const industryRoutes = require('./routes/industry.routes');
const adminRoutes = require('./routes/admin.routes');
const pickupRoutes = require('./routes/pickup.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require("./routes/payment.routes");


const app = express();

app.use(cors({
    origin : ['http://localhost:5173', 'http://localhost:5174'],
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
app.use('/api/industry', industryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/user', userRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
    connectDatabase();
})