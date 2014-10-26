//Collection model
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
	title: String,
	description: String,
	owners: [{type: Schema.Types.ObjectId, ref: 'User'}],
	locations: [{type: Schema.Types.ObjectId, ref: 'Location'}],
	updated_at: {type: Date},
	created_at: {type: Date}
});

collectionSchema.index({'locations':1});
collectionSchema.index({'owners':1});

collectionSchema.pre('save', function(next) {
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at)
		this.created_at = now;

	next();
});

collectionSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.__v;
	return obj;
}

module.exports = mongoose.model('Collection', collectionSchema);
