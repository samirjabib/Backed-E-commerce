const express = require('express');
const helmet = require('helmet'); // more security
const compression = require('compression');  //compress the responses for better performance
const morgan = require('morgan'); // It helps us to know what requests are coming to the server.
const cors = require('cors'); 
const rateLimit = require('express-rate-limit'); //limit requests
const path = require('path');

//  * CONTROLLERS
const {  globalErrorHandler } = require('./controllers/error.controller')

// *  ROUTES
const { usersRouter } = require('./routes/users.routes');
const { productsRouter } =  require('./routes/products.routes');
const { cartRouter } =  require('./routes/cart.routes');

// * MIDDLEWARES

const { AppError } = require('./utils/appError.util')

//Init express
const app = express();


// Enable incoming JSON data
app.use(express.json());


// Set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Enable CORS
app.use(cors());


// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());


// Log incoming requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));


// Limit IP requests
const limiter = rateLimit({
    max: 10000,
    windowMs: 1 * 60 * 60 * 1000, // 1 hr
    message: 'Too many requests from this IP',
  });
  
  app.use(limiter);


//  *ENDPOINTS

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);



app.all('*',(req,res,next) => {
  next( new AppError (`${req.method} ${req.url} not found in this server`),404 )
})

app.use(globalErrorHandler); 

module.exports = { app }