const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('config');
const expressValidator = require('express-validator');
const http = require('./db/http');
const userRoutes = require('./api/routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());

//set up CORS to pass correct headers
// https://www.youtube.com/watch?v=zoSJ3bNGPp0
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
} 

//set up routes
app.use('/user', userRoutes);

//error handling if no routing was hit
app.use((req, res, next) => {
    http.show404(req,res,next);
});

//internal server error
app.use((error, req, res, next) => {
    console.log(error);
    http.show500(req,res,error);
});

module.exports = app;