const _ = require('lodash');
const casual = require('casual');

const {
    db, 
    Person, 
    Relationship, 
    FriendRequest, 
    FriendRequestStatus,
} = require('../model');


function many(factory, count) {
    const data = new Array(count);
    
    for (; count > 0; --count) {
        data[count - 1] = factory();
    }

    return data;
}

function randomPairs(array, count) {
    const pairs = [];
    const choices = {};

    array.slice(0, -1).forEach(
        (item, index) => choices[index] = null
    );

    for (let i = 0; i < count; ++i) {
        const firstIndex = parseInt(_.sample(Object.keys(choices)), 10);

        let secondChoices = choices[firstIndex];
        
        if (!secondChoices) {
            secondChoices = choices[firstIndex] = _.shuffle(
                _.range(firstIndex + 1, array.length)
            );
        }

        const secondIndex = secondChoices.shift();

        pairs.push([array[firstIndex], array[secondIndex]]);

        if (!secondChoices.length) {
            delete choices[firstIndex];
        }
    }

    return pairs;
}


const person = () => ({
    email: casual.email,
    password: 'pass',
    name: casual.full_name,
    address: casual.address,
});
const people = (count) => many(person, count);

const relationship = ({from, to}) => ({
    fromId: from.id,
    toId: to.id,
    requestId: null,
});
const relationships = (pairs) => [
    ...pairs.map(relationship),
    ...pairs.map(({from, to}) => relationship({from: to, to: from})),
];

const request = ({from, to}) => ({
    fromId: from.id,
    toId: to.id,
    status: FriendRequestStatus.pending,
    message: casual.sentence,
});
const requests = (pairs) => pairs.map(request);

const now = new Date();

db
.sync()
.then(() => Person.bulkCreate(people(100)))
.then(() => Person.findAll({where: {createdAt: {$gt: now}}}))
.then((people) => {
    const relCount = people.length * 3;
    const reqCount = people.length * 2;

    const pairs = 
        randomPairs(people, relCount + reqCount)
        .map(([from, to]) => ({from, to}));
    
    const rels = relationships(pairs.slice(0, relCount));
    const reqs = requests(pairs.slice(relCount, pairs.length));

    return Promise.all([
        Promise.resolve(people),
        Relationship.bulkCreate(rels),
        FriendRequest.bulkCreate(reqs),
    ]);
});
