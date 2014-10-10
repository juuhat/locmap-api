// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var passport = require('./config/passport');

app.use(passport.initialize());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongoDB connection
mongoose.connect('mongodb://localhost/loc');

//set port
var port = process.env.PORT || 8080;

// REGISTER ROUTES
// all of our routes will be prefixed with /api/v1
app.use('/api/v1', require('./routes.js'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port: ' + port);
