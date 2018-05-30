'use strict';

module.exports = (sequelize, DataTypes) => {
    var Transaction = sequelize.define('Transaction', {
            coin: DataTypes.STRING,
            coinId: DataTypes.STRING,
            purchasePrice: DataTypes.STRING,
            purchaseAmount: DataTypes.FLOAT,
    });

    Transaction.associate = function (models) {
        models.Transaction.belongsTo(models.User);
    };
    return Transaction;
};