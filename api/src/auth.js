const {BasicStrategy} = require('passport-http');

const {Person} = require('./model');


function verify(req, username, password, done) {
    Person
    .findOne({where: {email: username.toLowerCase()}})
    .then((person) => done(
        null, 
        person && person.testPassword(password) ? person : {}
    ));
}

module.exports.basic = new BasicStrategy({passReqToCallback: true}, verify);
