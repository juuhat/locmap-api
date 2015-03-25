var supertest = require('supertest');
var mongoose   = require('mongoose');
var mockgoose  = require('mockgoose');
var url = 'http://localhost:4000/api/v1';

process.env.TEST = true;

before(function(done) {
	//set up mongoose
	mockgoose(mongoose);
	mongoose.connect('mongodb://localhost/locmap');
	
	//start server
	var server = require('../app');
	this.app = server.app.listen(4000);

	done();
});

describe('LocMap API usage', function() {

	var ctx = { };
	ctx.user = { email: "tester@example.com", password: "Test@9321", username: "tester" };
	ctx.location = { title: "Test", description: "Test description", latitude: 23.1, longitude: 62 };

	//AUTH
	describe('auth', function() {
		it('should reject invalid email in register', function(done) {
			supertest(url)
			.post('/auth/register')
			.send({email: "legitq@@.com", password: "test1234", username: "qqlegit"})
			.expect(400, done);
		});

		it('should register user with valid credentials', function(done) {
			supertest(url)
			.post('/auth/register')
			.send(ctx.user)
			.expect(200, done);
		});

		it('should reject wrong password in login', function(done) {
			supertest(url)
			.post('/auth/login')
			.send({email: ctx.user.email, password: "Test98765"})
			.expect(400, done);
		});

		it('should login with correct credentials', function(done) {
			supertest(url)
			.post('/auth/login')
			.send({email: ctx.user.email, password: ctx.user.password})
			.expect(200, function(err, res) {
				if (err)
					return done(err)

				ctx.user.token = res.headers['x-access-token'];
				done();
			});
		});
	});

	//LOCATIONS
	describe('location', function() {
		it('should reject location creation with invalid auth token', function(done) {
			supertest(url)
			.post('/locations')
			.set('Authorization', 'Bearer 1234567890')
			.send(ctx.location)
			.expect(401, done);
		});

		it('should create location with correct data', function(done) {
			supertest(url)
			.post('/locations')
			.set('Authorization', 'Bearer ' + ctx.user.token)
			.send(ctx.location)
			.expect(200, function(err, res) {
				if (err)
					return done(err)

				ctx.location.id = res.body._id;
				done();
			});
		});

		it('should get existing location with correct objectId', function(done) {
			supertest(url)
			.get('/locations/a' + ctx.location.id)
			.expect(200, done);
		});
	});

});

after(function() {
	mockgoose.reset();
	mongoose.connection.close();
	this.app.close();
});
