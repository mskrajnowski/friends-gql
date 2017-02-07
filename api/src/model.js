const Sequelize = require('sequelize');
const sql = Sequelize;

const db = new Sequelize(
    'postgres://friends_gql:friends_gql@localhost:5432/friends_gql',
    {}
);
module.exports.db = db;

module.exports.Person = db.define('Person', {

}, {

});

module.exports.FriendRequest = db.define('FriendRequest', {

}, {

});
