const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const sql = Sequelize;

const db = new Sequelize(
    'postgres://friends_gql:friends_gql@localhost:5432/friends_gql', 
    {}
);

const Person = db.define('Person', {
    id: {
        type: sql.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sql.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
        set(val) {
            this.setDataValue('email', val.toLowerCase());
        }
    },
    password: {
        type: sql.VIRTUAL,
        set(val) {
            this.setDataValue('password', val);
            this.setDataValue(
                'passwordHash', 
                val ? bcrypt.hashSync(val, 10) : null
            );
        },
    },
    passwordHash: {
        type: sql.STRING,
        validate: {
            notEmpty: true,
        },
    },
    name: {
        type: sql.STRING,
        allowNull: false,
        defaultValue: '',
    },
    address: {
        type: sql.STRING,
        allowNull: false,
        defaultValue: '',
    },
}, {
    instanceMethods: {
        testPassword(password) {
            return bcrypt.compareSync(password, this.passwordHash);
        },
    },
});

const Relationship = db.define('Relationship', {
    id: {
        type: sql.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
}, {});

const FriendRequest = db.define('FriendRequest', {
    message: {
        type: sql.STRING,
        allowNull: false,
        defaultValue: '',
    },
}, {

});

Person.belongsToMany(Person, {
    as: 'friends',
    through: Relationship,
    foreignKey: {
        name: 'fromId',
        allowNull: false,
    },
    otherKey: {
        name: 'toId',
        allowNull: false,
    },
})
Relationship.belongsTo(FriendRequest, {as: 'request'});
FriendRequest.belongsTo(Person, {
    as: 'from',
    foreignKey: {allowNull: false},
});
FriendRequest.belongsTo(Person, {
    as: 'to',
    foreignKey: {allowNull: false},
});

module.exports = {
    db, 
    Person, 
    Relationship, 
    FriendRequest, 
};
