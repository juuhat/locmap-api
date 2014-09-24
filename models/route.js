//Route model
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var routeSchema = new Schema({
	title: String,
	description: String,
	locations: [String]
});

module.exports = mongoose.model('Route', routeSchema);