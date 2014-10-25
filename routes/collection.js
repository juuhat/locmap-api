var router = require('express').Router();
var passport = require('passport');

var User = require('../models/user.js');
var Location = require('../models/location.js');
var Collection = require('../models/collection.js');

//GET
//Get collection specified by id
router.get('/collections/:id', function(req, res) {
	Collection.findById(req.params.id, function(err, doc) {
		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Not found"});

		res.json(doc);
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

		Collection.findByIdAndUpdate(req.params.id, req.body, function(err, doc2) {
			if (err)
				return res.status(400).json({message: err.message});

			res.json(doc2);
		});

	});
});


module.exports = router;
