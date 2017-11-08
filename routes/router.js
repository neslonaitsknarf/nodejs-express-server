var express = require('express');
var path = require('path');
var router = express.Router();
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'nodejs-express-server-router.js'});
//var compression = require('compression')
// CONSTANTS
const request = require('request');

// compress all responses
//router.use(compression())

// MIDDLEWARE FOR ALL ROUTES IN THIS ROUTER
// must be specified before all routes
router.use(function timeLog (req, res, next) {
  d = new Date();
  log.info('API access Time: ', d.toLocaleString());
  next()
})

// REGISTER ALL OUR ROUTES HERE
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
 router.get('/', function(req, res) {
     res.json({ message: 'hooray! welcome to our api!' });
 });

// get all the users (accessed at GET http://localhost:8080/api/users)
// Example for using Jsonplaceholder External Fake Online REST API for Testing and Prototyping
// fetches from specified url argument
 const options = {
     url: 'https://jsonplaceholder.typicode.com/posts',
     method: 'GET',
     headers: {
         'Accept': 'application/json',
         'Accept-Charset': 'utf-8'
     }
 };

router.get('/users', function(req, res) {
         request(options, function(err, output, body) { //get fake test data
            if (err)
            res.send(err);
            var json = JSON.parse(body);
            log.info(json); // Logging the output within the request function
            res.json(json) //then returning the response.. The request.json is empty over here
    		}); //closing the request function
    });

// ALL ERROR HANDLERS MUST BE SPECIFIED AFTER ROUTES
// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);

});

// error handler use previous errors or catch 500
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(err.status).jsonp({ error: res.locals.message});
  });

module.exports = router