const passport = require('passport');
const localStrategy = require('./strategies/passport.local');
const { jwt, recoveryPassword } = require('./strategies/passport.jwt');

//strategies
passport.use(localStrategy);
passport.use('jwt', jwt);
passport.use('recoveryPassword', recoveryPassword);