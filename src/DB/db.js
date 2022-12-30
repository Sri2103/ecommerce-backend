require('dotenv').config();
const Mongoose = require("mongoose");
const mongoURI = process.env.mongo_url
const connectDB = () =>{
    Mongoose.set('strictQuery', false);
    Mongoose.connect(mongoURI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Connected to MongoDB')).catch((err) => console.error(err))
}

module.exports = connectDB