const express = require('express');
const helmet = require('helmet'); // more security
const compression = require('compression');  //compress the responses for better performance
const morgan = require('morgan'); // It helps us to know what requests are coming to the server.
const path = require('path');
const cors = require('cors'); 
const rateLimit = require('express-rate-limit'); //limit requests


// Controllers
const {  globalErrorHandler } = require('./controllers/error.controller')

//Routes
const { usersRouter } = require('./routes/users.routes');
const { } = require('./routes/products.routes')


//Init express
const app = express();

//Enable CORS
app.use(cors());


// Enable incoming JSON data
app.use(express.json());

// Limit IP requests
const limiter = rateLimit({
    max: 10000,
    windowMs: 1 * 60 * 60 * 1000, // 1 hr
    message: 'Too many requests from this IP',
  });
  
  app.use(limiter);


// Endpoints
app.use('/api/v1/users', usersRouter);


module.exports = { app }