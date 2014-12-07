//User model
var bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	token: String,
	role: {type: String, required: true},
	updated_at: {type: Date},
	created_at: {type: Date}
});

userSchema.pre('save', function(next) {
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at)
		this.created_at = now;

	next();
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

userSchema.methods.validateEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	delete obj.token;
	delete obj.__v;
	return obj;
}

module.exports = mongoose.model('User', userSchema);
