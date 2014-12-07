var router = require('express').Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var vars = require('../config/variables.js');

var User = require('../models/user.js');
var Location = require('../models/location.js');
var Collection = require('../models/collection.js');

router.post('/auth/register', function(req, res) {
	var newUser = new User();

	if (!newUser.validateEmail(req.body.email))
		return res.status(400).json({error: "Invalid email"});

	newUser.email = req.body.email;
	newUser.username = req.body.username;

	try {
		newUser.password = newUser.generateHash(req.body.password);
	} catch (err) {
		return res.status(400).json({error: "Bad password"});
	}

	newUser.role = "Normal";
	newUser.save(function(err, doc) {
		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Email already in use"});

		res.json(doc);
	});

});

router.post('/auth/login', function(req, res) {

	//callback for local authentication
	var onAuthenticated = function(err, user) {

		if(err)
			return res.status(400).json({message: err.message});

		if (!user)
			return res.status(400).json({message: "Wrong email or password"});

		//generate unique token
		user.token = jwt.sign({ id: user.id }, vars.tokenSecret,
			{ expiresInMinutes: 1440 });

		//save generated token
		user.save(function(err, doc) {
			if (err)
				return res.status(400).json({message: err.message});

			res.set('x-access-token', doc.token);
			return res.json(doc);
		});
	}

	//authenticate using the passport local strategy
	return passport.authenticate('local', { session: false }, onAuthenticated)(req, res);

});

router.post('/auth/logout', passport.authenticate('bearer'), function(req, res) {

	User.findById(req.user.id, function(err, doc) {

		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Not found"});

		doc.token = null;
		doc.save(function(err, doc) {
			res.json({message: "Logged out"});
		});

	});

});




module.exports = router;