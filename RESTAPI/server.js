const express = require('express');
const colors = require('colors')
const dotenv = require('dotenv').config()
const cors = require("cors");
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 9000

connectDB()

const app = express()
app.use(cors());  

app.use(express.urlencoded({extended: false}))

app.use('/api/goals', require('./routes/goalRoutes'))

app.use('/api/marketdata', require('./routes/marketDataRoutes'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(errorHandler)

app.listen(PORT, () => console.log(`server start on port ${PORT}`))