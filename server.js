var express = require('express');
var app = express();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs')
var rfs = require('rotating-file-stream')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var customRouter = require('./routes/router.js');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'nodejs-express-server-server.js'});


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

// Tell express to use this custom router with /api before in url.
// You can put just '/' if you don't want any sub path before routes.
app.use('/api', customRouter);

var server = app.listen(port, function () {

   console.log("Express Server app listening at http://localhost/", port)
});