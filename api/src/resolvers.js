const {
    Person, 
    Relationship, 
    FriendRequest, 
} = require('./model');

function authenticatedOrNull(fn) {
    return (obj, args, context) => 
        context.authenticated ? fn(obj, args, context) : null;
}

function ensureAuthenticated(fn) {
    return (obj, args, context) => {
        if (!context.authenticated) {
            throw new Error('Not authenticated');
        }

        return fn(obj, args, context);
    };
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
        updateProfile: ensureAuthenticated(
            (obj, {input}, context) => context.user.update(input)
        ),
        requestFriend: ensureAuthenticated(
            (obj, {input}, context) => 
                FriendRequest
                .create({
                    fromId: context.user.id,
                    toId: input.id,
                    message: input.message,
                })
        ),
        cancelRequest: ensureAuthenticated(
            (obj, {id}, context) =>
                FriendRequest
                .findOne({where: {id: id, fromId: context.user.id}})
                .then((request) => {
                    if (request) {
                        return request.destroy();
                    } else {
                        throw new Error('Request not found');
                    }
                })
                .then(() => context.user)
        ),
        acceptRequest: ensureAuthenticated(
            (obj, {id}, context) => 
                FriendRequest
                .findOne({where: {id: id, toId: context.user.id}})
                .then((request) => {
                    if (request) {
                        return Promise.all([
                            Relationship.bulkCreate([
                                {fromId: request.fromId, toId: request.toId},
                                {fromId: request.toId, toId: request.fromId},
                            ]),
                            request.destroy(),
                        ]);
                    } else {
                        throw new Error('Request not found');
                    }
                })
                .then(() => context.user)
        ),
        rejectRequest: ensureAuthenticated(
            (obj, {id}, context) => 
                FriendRequest
                .findOne({where: {id: id, toId: context.user.id}})
                .then((request) => {
                    if (request) {
                        return request.destroy();
                    } else {
                        throw new Error('Request not found');
                    }
                })
                .then(() => context.user)
        ),
        removeFriend: ensureAuthenticated(
            (obj, {id}, context) => 
                Relationship
                .destroy({
                    where: {$or: [
                        {fromId: context.user.id, toId: id},
                        {toId: context.user.id, fromId: id},
                    ]}
                })
                .then(() => context.user)
        ),
    },
};
