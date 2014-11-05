var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var passport   = require('./config/passport');
var vars       = require('./config/variables.js');

app.use(passport.initialize());

//configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//error handler
app.use(function(err, req, res, next) {
	return res.status(400).json({message: err.message});
});

//mongoDB connection
mongoose.connect(vars.mongodbAddress);

//set routes
app.use(vars.apiPrefix, require('./routes/location.js'));
app.use(vars.apiPrefix, require('./routes/collection.js'));
app.use(vars.apiPrefix, require('./routes/auth.js'));
app.use(vars.apiPrefix, require('./routes/user.js'));
app.use(vars.apiPrefix, require('./routes/image.js'));

//start server
app.listen(vars.port);
console.log('Listening on port: ' + vars.port);
