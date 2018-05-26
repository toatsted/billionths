'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        userId: {
            type: DataTypes.STRING,
            index: true
        },
        // Stores the symbols of the cryptocurrencies the user owns, as well as how much they own of it.
        wallet: DataTypes.STRING
    });

    User.associate = function (models) {
        models.User.hasMany(models.Transaction);
    };

    return User;
};