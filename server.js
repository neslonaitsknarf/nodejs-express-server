var express = require('express');
var app = express();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs')
var rfs = require('rotating-file-stream')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Local routes modules
var birds = require('./routes/birds')

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

// Example for using Jsonplaceholder External Fake Online REST API for Testing and Prototyping
// fetches from specified url argument
/*const options = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

app.get("/api/allposts", function(req, res)  {
        request(options, function(err, output, body) {
        var json = JSON.parse(body);
        console.log(json); // Logging the output within the request function
        res.json(json) //then returning the response.. The request.json is empty over here
		}); //closing the request function
    });
*/

//uses birds routes from /routes/birds.js
app.use('/birds', birds);

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

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
});