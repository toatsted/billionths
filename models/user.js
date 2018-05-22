'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        userId: {
            type: DataTypes.STRING,
            index: true
        }
    }, {
        defaultScope: {
            where: {
                active: true
            }
        },
        scopes: {
            activeTransactions: {
                include: [{
                    model: transactions,
                    where: {
                        active: true
                    }
                }]
            },
            deletedTransactions: {
                include: [{
                    model: transactions,
                    where: {
                        deleted: true
                    }
                }]
            }    
        }
    });

    User.associate = function (models) {
        models.User.hasMany(models.transactions, {
            foreignKey: 'transactions_id'
        });
    };

    return User;
};