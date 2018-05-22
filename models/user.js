'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        userId: {
            type: DataTypes.STRING,
            index: true
        }
    });

    User.associate = function (models) {
        models.User.hasMany(models.transactions, {
            foreignKey: 'transactions_id'
        });
    };

    return User;
};