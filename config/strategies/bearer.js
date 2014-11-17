var BearerStrategy = require('passport-http-bearer').Strategy;
var vars = require('../variables.js');

module.exports = new BearerStrategy(function(token, done) {
	var User = require('../../models/user.js');

	User.findOne({ token: token }, function(err, doc) {
		var user = doc;

		if(!user) {
			return done(null, null);
		}

		var jwt = require('jsonwebtoken');

		jwt.verify(user.token, vars.tokenSecret, function(err, decoded) {
			if(err) {
				return done(null, null, err);
			}
			return done(null, user);
		});

	});
});
