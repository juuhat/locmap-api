//Route model
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var routeSchema = new Schema({
	title: String,
	description: String,
	updated: {type: Date, default: Date.now},
	owners: [String],
	locations: [String]
});

module.exports = mongoose.model('Collection', routeSchema);
