// get an instance of the express Router
var router = require('express').Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var multer = require('multer');

//mongoose models
var User = require('./models/user.js');
var Location = require('./models/location.js');
var Collection = require('./models/collection.js');


/******************
LOCATIONS
******************/

router.get('/locations/:id', function(req, res) {
	Location.findById(req.params.id, function(err, doc) {
		if (err) { res.status(400).json({error: err}); }

			if (!doc) {
				return res.status(400).json({message: "Location not found"});
			}

		res.json(doc);
	});
});


router.post('/locations', function(req, res) {
	var newLocation = new Location(req.body);
	newLocation.save(function (err, doc) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.status(200).json({id: doc.id});
		}
	});
});


router.put('/locations/:id', function(req, res) {

	Location.findOneAndUpdate({"_id": req.params.id}, req.body, {upsert:true}, function(err, doc){
    	if (err) return res.status(400).json({error: err});
    	res.json(doc);
	});

});


router.delete('/locations/:id', function(req, res) {
	Location.findById(req.params.id, function(err, doc) {
		if (err) {
			res.status(400).json({error: err});
		}

		doc.remove(function(err) {
			res.json({id: "removed"});
		});

	});
});


/******************
COLLECTION
******************/

router.get('/collections/:id', function(req, res) {
	Collection.findById(req.params.id, function(err, doc) {
		if (err) { res.status(400).json({error: err}); }
		res.json(doc);
	});
});

router.post('/collections', function(req, res) {
	var newCollection = new Collection(req.body);
	newCollection.save(function (err, doc) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json({id: doc.id});
		}
	});
});


/******************
USER
******************/

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


/******************
AUTH
******************/

router.post('/auth/register', function(req, res) {
	var newUser = new User();

	if (!validateEmail(req.body.email)) {
		return res.status(400).json({error: "Invalid email"});
	}

	newUser.email = req.body.email;
	newUser.username = req.body.username;

	try {
		newUser.password = newUser.generateHash(req.body.password);
	} catch (err) {
		return res.status(400).json({error: "Bad password"});
	}

	newUser.save(function(err, doc) {

		if (err) {
			res.status(500).json({error: "Internal server error"});
		}

		if (!doc) {
			res.status(400).json({error: "Email already in use"})
		}

		res.json(doc);

	});

});

router.post('/auth/login', function(req, res) {

	// callback for local authentication
	var onAuthenticated = function(err, user) {

		if(err) {
			return res.status(400).json({error: err});
		}

		if (!user) {
			return res.status(400).json({message: "Wrong email or password"});
		}

		// generate unique token for the user
		user.token = jwt.sign({ id: user.id }, "token-secret",
			{ expiresInMinutes: 1440 });

		// store generated token in db for further authentication
		user.save(function(err, doc) {
			res.set('x-access-token', doc.token);
			return res.json(200, doc);
		});
	}

	// authenticate using the passport local strategy
	return passport.authenticate('local', { session: false }, onAuthenticated)(req, res);

});

router.post('/auth/logout', passport.authenticate('bearer', { session: false }), function(req, res) {

	User.findById(req.user.id, function(err, doc) {
		doc.token = null;

		doc.save(function(err, doc) {
			res.json({message: "Logged out"});
		});

	});

});


/***********************
IMAGE UPLOAD
***********************/

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


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = router;
