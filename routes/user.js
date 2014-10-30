var router = require('express').Router();
var passport = require('passport');
var async = require('async');

var User = require('../models/user.js');
var Location = require('../models/location.js');
var Collection = require('../models/collection.js');
var Image = require('../models/image.js');

router.get('/users/:id', function(req, res) {

	User.findById(req.params.id, function(err, doc) {
		if (err)
			res.status(400).json({message: err.message});

		if (!doc)
			res.status(400).json({message: "Not found"});

		async.parallel([

			//Get user's locations
			function(callback) {
				Location.find({owners: doc.id}, '_id title', function(err, locations) {
					if (err)
						callback(err)

					callback(null, locations);
				});
			},

			//Get user's collections
			function(callback) {
				Collection.find({owners: doc.id}, '_id title', function(err, collections) {
					if (err)
						callback(err)

					callback(null, collections);
				});
			},

			//Get user's images
			function(callback) {
				Image.find({owner: doc.id}, '_id', function(err, images) {
					if (err)
						callback(err)

					callback(null, images);
				});
			}

		],

		//Handle results
		function(err, results) {

			if (err)
				return res.status(400).json({message: err.message});

			var user = {};
			user.username = doc.username;
			user.locations = results[0] || [];
			user.collections = results[1] || [];
			user.images = results[2] || [];

			res.json(user);
		});

	});

});

module.exports = router;