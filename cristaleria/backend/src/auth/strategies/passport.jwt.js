const { ExtractJwt, Strategy } = require('passport-jwt');
const { Jwt } = require('../../../config');

const jwt = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Jwt.secret
}, async(payload, done) => {
    // payload = token
    if (!payload) {
        return done('Unauthorized', false);
    }
    return done(null, payload);
});

const recoveryPassword = new Strategy({
    jwtFromRequest: ExtractJwt.fromHeader('x-recovery-authenticate'),
    secretOrKey: Jwt.recoverySecret,
}, async (payload, done) => {
    done(null, payload)
});

module.exports = {
    jwt,
    recoveryPassword
};