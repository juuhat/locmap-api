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
	owners: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

locationSchema.index({'owners':1});

locationSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.__v;
	return obj;
}

module.exports = mongoose.model('Location', locationSchema);
