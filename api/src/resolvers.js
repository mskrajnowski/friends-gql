const {Person, FriendRequest} = require('./model');

module.exports = {
    Person: {
        friends: (person) => person.getFriends(),
    },
    FriendRequest: {
        from: (request) => request.getFrom(),
        to: (request) => request.getTo(),
    },
    Query: {
        me: (obj, args, context) => 
            context.authenticated ? 
            context.user : 
            null,
        sentRequests: (obj, args, context) => 
            context.authenticated ? 
            FriendRequest.findAll({where: {fromId: context.user.id}}) :
            null,
        receivedRequests: (obj, args, context) =>
            context.authenticated ?
            FriendRequest.findAll({where: {toId: context.user.id}}) : 
            null,

        people: () => Person.findAll(),
    },
    Mutation: {
        
    },
};
