const {BasicStrategy} = require('passport-http');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const {Person} = require('./model');


const SECRET = 'secret';


function verifyBasic(req, username, password, done) {
    req.loaders.Person.byEmail
    .load(username.toLowerCase())
    .then((person) => done(
        null, 
        person && person.testPassword(password) ? person : null
    ));
}
const basicStrategy = new BasicStrategy(
    {
        passReqToCallback: true,
    }, 
    verifyBasic
);

function verifyJWT(req, payload, done) {
    req.loaders.Person.byId
    .load(payload.id)
    .then((person) => done(null, person));
}

function generateJWT(person) {
    const payload = {id: person.id};
    return jwt.sign(payload, SECRET);
}

const jwtStrategy = new JWTStrategy(
    {
        passReqToCallback: true,
        jwtFromRequest: ExtractJWT.fromAuthHeader(),
        secretOrKey: SECRET,
    }, 
    verifyJWT
);

module.exports = {
    basic: basicStrategy,
    jwt: jwtStrategy,
    generateJWT,
};
