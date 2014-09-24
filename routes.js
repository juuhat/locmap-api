// get an instance of the express Router
var router = require('express').Router(); 				
var passport = require('passport');
var jwt = require('jsonwebtoken');

//mongoose models
var User = require('./models/user.js');
var Route = require('./models/user.js');
var Location = require('./models/location.js');


/******************
LOCATIONS
******************/

router.get('/location/:id', function(req, res) {
	Location.findById(req.params.id, function(err, doc) {
		if (err) { res.status(400).json({error: err}); }
		res.json(doc);
	});
});


router.post('/location', function(req, res) {
	var newLocation = new Location(req.body);
	newLocation.save(function (err, doc) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json({id: doc.id});
		}
	});
});


router.put('/location/:id', function(req, res) {
	
	Location.findOneAndUpdate({"_id": req.params.id}, req.body, {upsert:true}, function(err, doc){
    	if (err) return res.status(400).json({error: err});
    	res.json(doc);
	});

});


router.delete('/location/:id', function(req, res) {
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
AUTH
******************/

router.post('/auth/register', function(req, res) {
	
	var newUser = new User();
	newUser.email = req.body.email;
	newUser.username = req.body.username;
	newUser.password = newUser.generateHash(req.body.password);

	newUser.save(function(err, doc) {
		if (err) {
			res.status(400).json({error: err});
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
			return res.status(400).json({message: "User not found"});
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

/*router.post('/auth/logout', passport.authenticate('bearer', { session: false }), function(req, res) {
});*/

module.exports = router;