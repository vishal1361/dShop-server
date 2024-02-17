const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

const authRoutes = require('./routes/auth')
const sellerRoutes = require('./routes/sellerServices')
const buyerRoutes = require( './routes/buyerServices' )

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', authRoutes);
app.use('/buyer', buyerRoutes);
app.use('/seller', sellerRoutes);
// app.use('/admin', )

app.get('/', (req, res) => {
    res.send("Hello FRONTEND!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT NUMBER: ${PORT}`);
});
