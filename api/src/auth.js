const BasicStrategy = require('passport-http').BasicStrategy;

function verify(req, username, password, done) {
    done(null, {});
}

module.exports.basic = new BasicStrategy({passReqToCallback: true}, verify);
