var router = require('express').Router();
var passport = require('passport');
var multer = require('multer');
var gm = require('gm');
var fs = require('fs');

var Image = require('../models/image.js');

var handler = multer({
	dest: './uploads/',
	inMemory: true,
	onFileUploadStart: function (file) {
		var ext = file.extension.toLowerCase();
		if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
			return false;
		}
	}
});

router.post('/uploads', passport.authenticate('bearer', { session: false }), handler, function(req, res, next) {
	var imgData = req.files.image;

	if (!imgData)
		return res.status(400).json({message: "Invalid file"});

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
			
			newImage.save(function (err, doc) {
				if (err)
					res.status(400).json({message: err.message});

				res.json({id: doc.id});
			});
		});
	});

});

router.get('/uploads/:id', function(req, res) {
	Image.findById(req.params.id, function(err, doc) {
		if (err)
			res.status(400).json({message: err.message});

		res.contentType(doc.contentType);
		res.send(doc.data);
	});
});

module.exports = router;