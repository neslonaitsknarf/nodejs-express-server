var express = require('express');
var app = express();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs')
var rfs = require('rotating-file-stream')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// CONSTANTS
const request = require('request');

// configuration for listening port
const port = process.env.PORT || 8081; // set our port

// ensure log directory exists
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// CREATE A ROTATING ACCESS LOG
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

// SETUP THE LOGGER
app.use(logger('combined', {stream: accessLogStream}))

// INDEX ROUTE
// for testing everything is u and running, hit localhost:8081 in browser
app.get('/', function (req, res) {
   res.send('Hello World og Humans and droids are you there???');
})

// configure app to use bodyParser() in case of HTML form input
// this will let us get the data from input filed via POST request
// if forms are being used in frontend app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make express router
var router = express.Router();

// MIDDLEWARE FOR ALL ROUTES IN THIS ROUTER
// must be specified before all routes
router.use(function timeLog (req, res, next) {
  console.log('API access Time: ', Date.now())
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
           // console.log(json); // Logging the output within the request function
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

// Tell express to use this router with /api before in url.
// You can put just '/' if you don't want any sub path before routes.
app.use('/api', router);

var server = app.listen(port, function () {

   console.log("Example app listening at http://localhost/", port)
});