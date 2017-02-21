const _ = require('lodash');
const DataLoader = require('dataloader');

const {Person, Relationship, FriendRequest} = require('./model');


const loaderFactories = {
    Person: (req) => {
        const byId = new DataLoader((ids) => 
            Person
            .findAll({where: {id: {$in: ids}}})
            .then(primeMany)
            .then((people) => {
                const peopleById = _.keyBy(people, 'id');
                return ids.map((id) => peopleById[id] || null);
            })
        );

        const byEmail = new DataLoader((ids) => 
            Person
            .findAll({where: {email: {$in: ids}}})
            .then(primeMany)
            .then((people) => {
                const peopleById = _.keyBy(people, 'email');
                return ids.map((id) => peopleById[id] || null);
            })
        );

        const friendsOfId = new DataLoader((ids) =>
            Relationship
            .findAll({where: {fromId: {$in: ids}}})
            .then((rels) => Promise.all(rels.map(
                (rel) => byId.load(rel.toId).then((to) => ({
                    fromId: rel.fromId,
                    to: to,
                }))
            )))
            .then((rels) => {
                const relsByFromId = _.groupBy(rels, 'fromId');
                return ids.map((id) => {
                    const rels = relsByFromId[id];
                    return rels ? rels.map((rel) => rel.to) : [];
                });
            })
        );

        const all = _.memoize(() => Person.findAll().then(primeMany));

        const prime = (person) => {
            byId.prime(person.id, person);
            byEmail.prime(person.email, person);
            return person;
        };

        const primeMany = (people) => {
            people.forEach(prime);
            return people;
        };

        return {byId, byEmail, friendsOfId, all};
    },
};


function createLoaders(req) {
    const loaders = {};

    for (const key in loaderFactories) {
        loaders[key] = loaderFactories[key](req);
    }

    return loaders;
}


function loadersMiddleware(req, res, next) {
    req.loaders = createLoaders(req);
    next();
}


module.exports = {
    createLoaders,
    loadersMiddleware,
};
