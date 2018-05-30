'use strict';

module.exports = (sequelize, DataTypes) => {
    var Transaction = sequelize.define('Transaction', {
            coin: DataTypes.STRING,
            coinId: DataTypes.STRING,
            purchasePrice: DataTypes.STRING,
            purchaseAmount: DataTypes.FLOAT,
        });

    return Transaction;
};