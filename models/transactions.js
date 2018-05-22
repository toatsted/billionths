'use strict';

module.exports = (sequelize, DataTypes) => {
    var transactions = sequelize.define('transactions', {
        coin: DataTypes.STRING,
        coinId: DataTypes.STRING,
        purchasePrice:  DataTypes.STRING,
        purchaseAmount: DataTypes.STRING       
    });

    transactions.associate = function (models) {
        models.transactions.hasOne(models.User);
    };

    return transactions;
};