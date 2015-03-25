var supertest = require('supertest');
var mongoose   = require('mongoose');
var mockgoose  = require('mockgoose');
var url = 'http://localhost:4000/api/v1';

process.env.TEST = true;

before(function(done) {
	//set up mongoose
	mockgoose(mongoose);
	//mongoose.connect('mongodb://localhost/locmap');
	
	//start server
	var server = require('../app');
	this.app = server.app.listen(4000);

	done();
});

describe('auth', function() {
	it('should reject invalid email', function(done) {
		supertest(url)
		.post('/auth/register')
		.send({email: "legitq@@.com", password: "test1234", username: "qqlegit"})
		.expect(400, done);
	});

	it('should register user with valid credentials', function(done) {
		supertest(url)
		.post('/auth/register')
		.send({email: "tester@example.com", password: "Test@9321", username: "tester"})
		.expect(200, done);
	});

});

after(function() {
	mockgoose.reset();
	mongoose.connection.close();
	this.app.close();
});