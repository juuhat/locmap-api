var express    = require('express');
var express        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var passport   = require('./config/passport');
var vars       = require('./config/variables.js');

var isTestEnv = process.env.TEST;

express.use(passport.initialize());

//configure express to use bodyParser()
express.use(bodyParser.urlencoded({ extended: true }));
express.use(bodyParser.json());

//error handler
express.use(function(err, req, res, next) {
	return res.status(400).json({message: err.message});
});

//mongoDB connection
if (!isTestEnv) {
	mongoose.connect(vars.mongodbAddress);
}

//set routes
express.use(vars.apiPrefix, require('./routes/location.js'));
express.use(vars.apiPrefix, require('./routes/collection.js'));
express.use(vars.apiPrefix, require('./routes/auth.js'));
express.use(vars.apiPrefix, require('./routes/user.js'));
express.use(vars.apiPrefix, require('./routes/image.js'));

module.exports.app = express;

//start server
if (!isTestEnv) {
	express.listen(vars.port);
	console.log('Listening on port: ' + vars.port);
}
