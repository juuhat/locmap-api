var passport = require('passport');

//initialize passport strategies
passport.use(require('./strategies/local'));
passport.use(require('./strategies/bearer'));

//export passport
module.exports = passport;