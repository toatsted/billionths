'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        userId: {
            type: DataTypes.STRING,
            index: true
        },
        money: DataTypes.FLOAT
    });

    User.associate = function (models) {
        models.User.hasMany(models.Transaction, {
            foreignKey: 'TransactionId', sourceKey: 'UserId'
        });
    };

    return User;
};