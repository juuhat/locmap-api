//Image model
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var imageSchema = new Schema({
	data: Buffer,
	contentType: String,
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	location: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
	created_at: {type: Date}
});

imageSchema.index({'owner':1});
imageSchema.index({'location':1});

imageSchema.pre('save', function(next) {
	var now = new Date();
	if (!this.created_at)
		this.created_at = now;

	next();
});

module.exports = mongoose.model('Image', imageSchema);
