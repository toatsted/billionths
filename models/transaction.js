'use strict';

module.exports = (sequelize, DataTypes) => {
    let Transaction = sequelize.define('Transaction', {
        coin: DataTypes.STRING,
        coinId: DataTypes.STRING,
        purchasePrice:  DataTypes.STRING,
        purchaseAmount: DataTypes.STRING       
    }, {
        defaultScope: {
            where: {
                active: true
            }
        },
        scopes: {
            deleted: {
                where: {
                    deleted: true
                }
            },
        }
    });

    Transaction.associate = function (models) {
        models.Transaction.belongsTo(models.User, {
            foreignKey: 'id'
        });
    };

    return Transaction;
};