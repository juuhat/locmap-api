var router = require('express').Router();
var passport = require('passport');

var Location = require('../models/location.js');

//GET
//Get location specified by id
router.get('/locations/:id', function(req, res) {
  Location.findById(req.params.id, function(err, doc) {

      if (err)
        res.status(400).json({message: err.message});

      if (!doc)
        return res.status(400).json({message: "Not found"});

      res.json(doc);
  });
});

//POST
//Create new location
router.post('/locations', passport.authenticate('bearer'), function(req, res) {
  var newLocation = new Location(req.body);
  newLocation.owners = [req.user.id];
  
  newLocation.save(function (err, doc) {
    if (err)
      res.status(400).json({message: err.message});

    res.json({id: doc.id});
  });
});

//PUT
//Update location specified by id
router.put('/locations/:id', passport.authenticate('bearer'), function(req, res) {
  Location.findById(req.params.id, function(err, doc) {

    if (err)
      return res.status(400).json({message: err.message});

    if (!doc)
      return res.status(400).json({messsage: "Not found"});

    if (doc.owners.indexOf(req.user.id) === -1)
      return res.status(400).json({message: "Not owner"});

    req.body.updated_at = new Date();

    Location.findByIdAndUpdate(req.params.id, req.body, function(err, doc2) {
      if (err)
        return res.status(400).json({message: err.message});

      res.json(doc2);
    });

  });
});

//DELETE
//Delete location specified by id
router.delete('/locations/:id', passport.authenticate('bearer'), function(req, res) {
  Location.findById(req.params.id, function(err, doc) {
    
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
