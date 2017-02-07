const bodyParser = require('body-parser');
const express = require('express');
const graphqlExpress = require('graphql-server-express').graphqlExpress;
const graphiqlExpress = require('graphql-server-express').graphiqlExpress;
const passport = require('passport');
const Sequelize = require('sequelize');

const schema = require('./schema');
const auth = require('./auth');
const model = require('./model');

model.db.sync().then(() => main());

function main() {
    const app = express();

    passport.use(auth.basic);
    passport.use(auth.jwt);

    app.use(passport.initialize());

    app.get(
        '/auth',
        passport.authenticate('basic', {session: false}),
        (req, res) => res.end(auth.generateJWT(req.user))
    );

    app.use(
        '/graphql',
        passport.authenticate(['basic', 'jwt'], {session: false}),
        bodyParser.json(), 
        graphqlExpress((req) => ({
            schema,
            context: {
                authenticated: !!req.user,
                user: req.user,
            },
        }))
    );

    app.use('/graphiql', graphiqlExpress({
        endpointURL: 'http://localhost:8000/graphql',
    }));

    app.listen(8000, () => console.log('http://localhost:8000/graphiql'));
}

