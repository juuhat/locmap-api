//Location model
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var locationSchema = new Schema({
	title: String,
	description: String,
	imgUrl: String,
	latitude: {type: Number, required: true},
	longitude: {type: Number, required: true},
	updated: {type: Date, default: Date.now},
	collections: [String]
});

module.exports = mongoose.model('Location', locationSchema);
