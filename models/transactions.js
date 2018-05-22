'use strict';

module.exports = (sequelize, DataTypes) => {
    var transactions = sequelize.define('transactions', {
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

    return transactions;
};