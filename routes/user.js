var router = require('express').Router();
var passport = require('passport');

var User = require('../models/user.js');
var Location = require('../models/location.js');
var Collection = require('../models/collection.js');

router.get('/users/:id', function(req, res) {

	User.findById(req.params.id, function(err, doc) {
		if (err) {
			res.status(400).json(err);
		}

		if (!doc) {
			//res.json()
		}

		res.json({username: doc.username});

	});

});

module.exports = router;