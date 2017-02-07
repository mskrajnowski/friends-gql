const fs = require('fs');
const path = require('path');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'));
const resolvers = require('./resolvers');

module.exports = makeExecutableSchema({
    typeDefs: typeDefs.toString(), 
    resolvers: resolvers,
});
