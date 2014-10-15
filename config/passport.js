var passport = require('passport');

//initialize passport strategies
passport.use(require('./strategies/local'));
passport.use(require('./strategies/bearer'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//export passport
module.exports = passport;
