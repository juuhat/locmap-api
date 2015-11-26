var router = require('express').Router();
var passport = require('passport');
var async = require('async');

var User = require('../models/user.js');
var Location = require('../models/location.js');
var Collection = require('../models/collection.js');
var Image = require('../models/image.js');

//GET
//GET all users
router.get('/users', passport.authenticate('bearer'), function(req, res) {
	User.find({}, function(err, doc) {
		if (err)
			res.status(400).json({message: err.message});

		if (!doc)
			res.status(400).json({message: "Not found"});

		if (req.user.role !== "Admin")
			res.status(400).json({message: "Unauthorized"});

		res.json({users: doc});
	});
});

//GET
//Get user specified by id
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
			}

		],

		//Handle results
		function(err, results) {

			if (err)
				return res.status(400).json({message: err.message});

			var user = {};
			user._id = doc.id;
			user.username = doc.username;
			user.created_at = doc.created_at;
			user.locations = results[0] || [];
			user.collections = results[1] || [];

			res.json(user);
		});

	});

});

//PUT
//Update user specified by id
router.put('/users/:id', passport.authenticate('bearer'), function(req, res) {
	User.findById(req.params.id, function(err, doc) {
    	if (err)
      		return res.status(400).json({message: err.message});

    	if (!doc)
      		return res.status(400).json({messsage: "Not found"});

    	if (req.user.role !== "Admin")
    		return res.status(400).json({message: "Unauthorized"});

    	req.body.updated_at = new Date();

    	User.findByIdAndUpdate(req.params.id, req.body, function(err, doc2) {
    		if (err)
    			return res.status(400).json({message: err.message});

    		res.json(doc2);
    	});

  });
});

//DELETE
//Delete usere specified by id
router.delete('/users/:id', passport.authenticate('bearer'), function(req, res) {
	User.findById(req.params.id, function(err, doc) {
		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Not found"});

		if (req.user.role !== "Admin")
			return res.status(400).json({message: "Unauthorized"});

		Image.remove({owner: doc.id}, function(err) {
			if (err)
				return res.status(400).json({message: err.message});

			doc.remove(function(err) {
				if (err)
					return res.status(400).json({message: err.message});

				res.json({message: "Deleted"});
			});
		});

	});
});


module.exports = router;
