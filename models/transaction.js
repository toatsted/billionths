'use strict';

module.exports = (sequelize, DataTypes) => {
    let Transaction = sequelize
        .define('Transaction', {
            coin: DataTypes.STRING,
            coinId: DataTypes.STRING,
            purchasePrice: DataTypes.STRING,
            purchaseAmount: DataTypes.FLOAT,
        },
            {
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

    return Transaction;
};