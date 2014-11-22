var router = require('express').Router();
var passport = require('passport');
var multer = require('multer');
var gm = require('gm');
var fs = require('fs');

var Image = require('../models/image.js');
var Location = require('../models/location.js');

var multerPreHandler = multer({
	dest: './uploads/',
	inMemory: true,
	onFileUploadStart: function (file) {
		var ext = file.extension.toLowerCase();
		if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
			return false;
		}
	}
});

//GET
//GET all images
router.get('/images', function(req, res) {
	Image.find({}, '_id location created_at owner', function(err, doc) {
		if (err)
			res.status(400).json({message: err.message});

		if (!doc)
			res.status(400).json({message: "Not found"});

		res.json(doc);
	});
});

//GET
//Get image specified by id
router.get('/images/:id', function(req, res) {
	Image.findById(req.params.id, function(err, doc) {
		if (err)
			res.status(400).json({message: err.message});

		if (!doc)
			res.status(400).json({message: "Not found"});

		res.contentType(doc.contentType);
		res.send(doc.data);
	});
});

//POST
//Create new image
router.post('/images', passport.authenticate('bearer', { session: false }), multerPreHandler, function(req, res, next) {
	var imgData = req.files.image;

	if (!imgData)
		return res.status(400).json({message: "Invalid file"});

	Location.findById(req.body.location, function(err, doc) {
		if (err)
			return res.status(400).json({message: err.message});

		if (!doc)
			return res.status(400).json({message: "Location not found"});

		if (doc.owners.indexOf(req.user.id) === -1)
			return res.status(400).json({message: "Not owner"});

		gm(imgData.buffer, imgData.name)
		.identify(function (err, data) {
			if (err)
				return res.status(400).json({message: "Invalid file"});

			this.resize(1024);
			this.quality(85);
			this.toBuffer('jpg', function(err, buffer) {
				if (err)
					return res.status(400).json({message: err.message});

				var newImage = new Image;
				newImage.data = buffer;
				newImage.contentType = "image/jpeg";
				newImage.owner = req.user.id;
				newImage.location = doc.id;
	
				newImage.save(function (err, doc2) {
					if (err)
						res.status(400).json({message: err.message});
	
					res.json({id: doc2.id});
				});

			});
		});
	});
});

//DELETE
//Delete image specified by id
router.delete('/images/:id', passport.authenticate('bearer'), function(req, res) {
  Image.findById(req.params.id, function(err, doc) {
    
    if (err)
      return res.status(400).json({message: err.message});

    if (!doc)
      return res.status(400).json({message: "Not found"});

    if (doc.owner !== req.user.id)
      return res.status(400).json({message: "Not owner"});

    doc.remove(function(err) {
      if (err)
        return res.status(400).json({message: err.message});

      res.json({message: "Deleted"});
    });

  });
});


module.exports = router;