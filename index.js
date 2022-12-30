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
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");



mongoose.set('strictQuery', false)
mongoose.connect(mongo_url).then(() => console.log("connected to MongoDB"))
.catch((err) => console.log(err))

const app = express();
Sentry.init({
    dsn: "https://ca41199617394abea3b9ddec958d8a33@o4504366759673856.ingest.sentry.io/4504415615057920",
    environment:process.env.NODE_ENV,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/stripe', stripeRoute);

app.use(Sentry.Handlers.errorHandler());
app.listen(5000, ()=>{
    console.log("Backend running")
})

