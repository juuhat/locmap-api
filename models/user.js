//User model
var bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	locations: [String],
	collections: [String],
	token: String
});

//generating a hash
userSchema.methods.generateHash = function(password) {

	if (password.length < 4) {
		throw new Error("Password too short");
	}

	return bcrypt.hashSync(password, 8);
};

//check if passwords match
userSchema.methods.matchPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	delete obj.token;
	delete obj.__v;
	return obj;
}

module.exports = mongoose.model('User', userSchema);
