var router = require('express').Router();
var passport = require('passport');
var async = require('async');

var Collection = require('../models/collection.js');
var Location = require('../models/location.js');
var Image = require('../models/image.js');

//GET
//Get collection specified by id
router.get('/collections/:id', function(req, res) {
	Collection.findById(req.params.id, function(err, collection) {
		if (err)
			return res.status(400).json({message: err.message});

		if (!collection)
			return res.status(400).json({message: "Not found"});

		//Find locations attached to collection
		Location.find({'_id': { $in: collection.locations}}, function(err, locations) {
  			
  			//Find images attached to location
  			async.map(locations, function(loc, done) {
  				Image.find({location: loc.id}, '_id', function(err, images) {
  			    	if (err)
  			    		done(err, null);

  			    	var loc2 = loc.toObject();
  			    	delete loc2.__v;

  			    	loc2.images = [];
  			    	images.forEach(function(e) {
  			    		loc2.images.push(e.id);
  			    	});

  			    	done(null, loc2);
  			});
  			},
  			
  			//Handle results
  			function(err, results) {
  			  if (err)
  			    return res.status(400).json({message: err.message});

  				var collection2 = collection.toObject();
  				delete collection2.__v;
  				collection2.locations = results;

  				res.json(collection2);
  			});

  		});
	});
});


//POST
//Create new collection
router.post('/collections', passport.authenticate('bearer'), function(req, res) {
	var newCollection = new Collection(req.body);
	newCollection.owners = [req.user.id];

	newCollection.save(function (err, doc) {
		if (err)
			return res.status(400).json({message: err.message});
		
		res.json(doc);
	});
});


//PUT
//Update collection specified by id
router.put('/collections/:id', passport.authenticate('bearer'), function(req, res) {
	Collection.findById(req.params.id, function(err, doc) {

		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Not found"});

		if (doc.owners.indexOf(req.user.id) === -1)
			return res.status(400).json({message: "Not owner"});

		req.body.updated_at = new Date();

		Collection.findByIdAndUpdate(req.params.id, req.body, function(err, doc2) {
			if (err)
				return res.status(400).json({message: err.message});

			res.json(doc2);
		});

	});
});

//DELETE
//Delete collection specified by id
router.delete('/collections/:id', passport.authenticate('bearer'), function(req, res) {
	Collection.findById(req.params.id, function(err, doc) {

		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Not found"});

		if (doc.owners.indexOf(req.user.id) === -1)
			return res.status(400).json({message: "Not owner"});

		doc.remove(function(err) {
			if (err)
				return res.status(400).json({message: err.message});

			res.json({message: "Deleted"});
		});

	});
});

module.exports = router;
