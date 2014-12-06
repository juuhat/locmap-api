var router = require('express').Router();
var passport = require('passport');

var Location = require('../models/location.js');
var Image = require('../models/image.js');

//GET
//GET all locations
router.get('/locations', function(req, res) {

  var query = Location.find({});

  var lat = req.param('lat');
  var lon = req.param('lon');
  var dist = req.param('dist');
  if (lat && lon && dist) {
    var radius = Math.sqrt((dist/2*dist/2)+(dist/2*dist/2));
    
    //Get coordinate bounds
    var northEast = calcCoords(lat, lon, radius, 45);
    var southWest = calcCoords(lat, lon, radius, 225);
    
    query.where('latitude').gt(southWest[0]).lt(northEast[0])
         .where('longitude').gt(southWest[1]).lt(northEast[1]);
  }

  query.exec(function(err, doc) {
    if (err)
      return res.status(400).json({message: err.message});

    if (!doc)
      return res.status(400).json({message: "Not found"});

    res.json({locations: doc});
  });
});

//GET
//Get location specified by id
router.get('/locations/:id', function(req, res) {
  Location.findById(req.params.id, function(err, doc) {

      if (err)
        return res.status(400).json({message: err.message});

      if (!doc)
        return res.status(400).json({message: "Not found"});

      //Find attached images
      Image.find({location: doc.id}, '_id', function(err, doc2) {
        if (err)
          return res.status(400).json({message: err.message});

        var location = doc.toObject();
        delete location.__v;
        location.images = [];

        if (doc2) {
          doc2.forEach(function(e) {
            location.images.push(e.id);
          });
        }

        res.json(location);

      });

  });
});

//POST
//Create new location
router.post('/locations', passport.authenticate('bearer'), function(req, res) {
  var newLocation = new Location(req.body);
  newLocation.owners = [req.user.id];
  
  newLocation.save(function (err, doc) {
    if (err)
      return res.status(400).json({message: err.message});

    res.json(doc);
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

    Image.remove({location: doc.id}, function(err) {
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

//Returns coordinates calculated from certain distance and direction.
//Params:
//lat = original latitude (in decimal degrees)
//lon = original longitude (in decimal degrees)
//dist = distance (in kilometers)
//brng = bearing or 'direction' (in degrees) (0=north,90=east,180=south=270=west)
function calcCoords(lat, lon, dist, brng) {
  var latRad = lat * (Math.PI/180);
  var lonRad = lon * (Math.PI/180);
  var brngRad = brng * (Math.PI/180);
  var R = 6371; //earth's radius in km

  var latRad2 = Math.asin(Math.sin(latRad)*Math.cos(dist/R) + Math.cos(latRad)*Math.sin(dist/R)*Math.cos(brngRad));

  var lonRad2 = lonRad + Math.atan2(Math.sin(brngRad)*Math.sin(dist/R)*Math.cos(latRad),
                         Math.cos(dist/R)-Math.sin(latRad)*Math.sin(latRad2));

  return [latRad2*(180/Math.PI), lonRad2*(180/Math.PI)];
}

module.exports = router;
