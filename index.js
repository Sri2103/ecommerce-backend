const { config } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require("dotenv").config()
const mongo_url = process.env.mongo_url;
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const stripeRoute = require('./routes/stripe');
const cors = require('cors');


mongoose.set('strictQuery', false)
mongoose.connect(mongo_url).then(() => console.log("connected to MongoDB"))
.catch((err) => console.log(err))

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/stripe', stripeRoute);


app.listen(5000, ()=>{
    console.log("Backend running")
})

