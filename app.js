var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var passport   = require('./config/passport');

app.use(passport.initialize());

//configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongoDB connection
mongoose.connect('mongodb://localhost/loc');

//set port
var port = process.env.PORT || 8080;

//set routes
app.use('/api/v1', require('./routes/location.js'));
app.use('/api/v1', require('./routes/collection.js'));
app.use('/api/v1', require('./routes/auth.js'));
app.use('/api/v1', require('./routes/user.js'));
app.use('/api/v1', require('./routes/image.js'));

//start server
app.listen(port);
console.log('Listening on port: ' + port);
