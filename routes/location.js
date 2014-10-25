// get an instance of the express Router
var router = require('express').Router();
var passport = require('passport');

var User = require('../models/user.js');
var Location = require('../models/location.js');
var Collection = require('../models/collection.js');

//GET location
//Get location specified by id
router.get('/locations/:id', function(req, res) {
  Location.findById(req.params.id, function(err, doc) {
    if (err) { res.status(400).json({error: err}); }

      if (!doc) {
        return res.status(400).json({message: "Not found"});
      }

    res.json(doc);
  });
});

//POST locations
//Create new location
router.post('/locations', passport.authenticate('bearer'), function(req, res) {
  var newLocation = new Location(req.body);
  newLocation.owners = [req.user.id];
  
  newLocation.save(function (err, doc) {
    if (err) {
      res.status(400).send(err);
    } else {
      User.findById(req.user.id, function(err, usr) {
        usr.locations.push(doc.id);
        usr.save(function(err, usr) {
          res.status(200).json({id: doc.id});
        });
      });
    }
  });

});

//PUT
//Update location specified by id
router.put('/locations/:id', passport.authenticate('bearer'), function(req, res) {
  Location.findOneAndUpdate({"_id": req.params.id}, req.body, {upsert:true}, function(err, doc){
      if (err) return res.status(400).json({error: err});
      res.json(doc);
  });
});

//DELETE
//
router.delete('/locations/:id', passport.authenticate('bearer'), function(req, res) {
  Location.findById(req.params.id, function(err, doc) {
    if (err) {
      res.status(400).json({error: err});
    }

    doc.remove(function(err) {
      res.json({id: "removed"});
    });

  });
});

module.exports = router;
