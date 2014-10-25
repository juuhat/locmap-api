var router = require('express').Router();
var passport = require('passport');
var multer = require('multer');

router.post('/uploads', passport.authenticate('bearer', { session: false }), function(req, res, next) {
	var handler = multer({
		dest: './uploads/',
		onFileUploadStart: function (file) {
			var ext = file.extension.toLowerCase();
			if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
				res.status(400).json({message: "Wrong image format"});
				return false;
			}
		},
		onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path)
			res.send("done");
		}
	});
	handler(req, res, next);
});

module.exports = router;