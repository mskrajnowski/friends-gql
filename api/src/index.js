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

    app.use(
        passport.initialize(),
        passport.authenticate('basic', {session: false})
    );

    app.use(
        '/graphql',
        bodyParser.json(), 
        graphqlExpress((req) => ({
            schema,
            context: {},
        }))
    );

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
    }));

    app.listen(8000, () => console.log('http://localhost:8000/graphiql'));
}

