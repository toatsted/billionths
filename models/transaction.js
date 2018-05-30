'use strict';

module.exports = (sequelize, DataTypes) => {
    var Transaction = sequelize.define('Transaction', {
            TransactionId: DataTypes.INTEGER,
            coin: DataTypes.STRING,
            coinId: DataTypes.STRING,
            purchasePrice: DataTypes.STRING,
            purchaseAmount: DataTypes.FLOAT,
    });

    Transaction.associate = function (models) {
        models.Transaction.belongsTo(models.User, {
            foreignKey: 'TransactionId', targetKey: 'UserId'
        });
    };
    return Transaction;
};