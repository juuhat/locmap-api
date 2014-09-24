//User model
var bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	token: String
});

//generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, 8);
};

//check if passwords match
userSchema.methods.matchPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);