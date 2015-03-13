var supertest = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var url = 'http://localhost:8080/api/v1';

before(function(done) {
	done();
});

describe('auth', function() {
	it('should reject invalid email', function(done) {
		supertest(url)
		.post('/auth/register')
		.send({email: "legitq@@.com", password: "test1234", username: "qqlegit"})
		.expect(400, done);
	});
});