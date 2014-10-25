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
	owners: [String],
	collections: [String]
});

locationSchema.statics.updateCollections = function(locId, collId) {
	this.findById(locId, function(err, doc) {

		console.log("doc.id: " + doc.id);
		console.log("collId:" + collId);

		var i = doc.collections.indexOf(collId);
		console.log("i: " + i);
		if (i === -1) {
			doc.collections.push(collId);
		} else {
			doc.collections.splice(i, 1);
		}

		doc.save();

	});

};

module.exports = mongoose.model('Location', locationSchema);
