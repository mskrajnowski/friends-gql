const {Person, FriendRequest} = require('./model');

function authenticatedOrNull(fn) {
    return (obj, args, context) => 
        context.authenticated ? fn(obj, args, context) : null;
}
module.exports = {
    Person: {
        friends: (person) => person.getFriends(),
    },
    FriendRequest: {
        from: (request) => request.getFrom(),
        to: (request) => request.getTo(),
    },
    Self: {
        person: (me) => me,
        sentRequests: (me) => 
            FriendRequest.findAll({where: {fromId: me.id}}),
        receivedRequests: (me) =>
            FriendRequest.findAll({where: {toId: me.id}}),
    },
    Query: {
        me: authenticatedOrNull((obj, args, context) => context.user),
        people: () => Person.findAll(),
    },
    Mutation: {
        
    },
};
