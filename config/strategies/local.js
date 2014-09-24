var LocalStrategy = require('passport-local').Strategy;

var options = {
	usernameField: 'email',
	passwordField: 'password'
}

module.exports = new LocalStrategy(options, function(email, password, done) {
	var User = require('../../models/user.js');

	User.findOne({ email: email }, function(err, doc) {
		var user = doc;
		
		if(!user) {
			return done(null, null);
		}

		if (!user.matchPassword(password)) {
			return done(null, null);
		}

		return done(null, user);

	});
});