var express = require('express');
var app = express();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs')
var rfs = require('rotating-file-stream')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Constants
const request = require('request');
// ensure log directory exists
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

// setup the logger
app.use(logger('combined', {stream: accessLogStream}))

//index route
app.get('/', function (req, res) {
   res.send('Hello World og Humans and droids are you there');
})

// configure app to use bodyParser() in case of HTML form input
// this will let us get the data from a POST
/*app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());*/

var port = process.env.PORT || 8081;        // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
var router = express.Router();


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

// get all the users (accessed at GET http://localhost:8080/api/users)
router.route('/users')
    .get(function(req, res) {
         request(options, function(err, output, body) { //get fake test data
            if (err)
            res.send(err);
            var json = JSON.parse(body);
            console.log(json); // Logging the output within the request function
            res.json(json) //then returning the response.. The request.json is empty over here
    		}); //closing the request function
    });


app.use('/api', router);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// catch 403 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Authorized');
  err.status = 403;
  next(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(err.status).jsonp({ error: res.locals.message});
});

var server = app.listen(port, function () {

   console.log("Example app listening at http://localhost/", port)
});