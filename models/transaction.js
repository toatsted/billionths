'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    coin: DataTypes.STRING,
    coinId: DataTypes.STRING,
    purchasePrice: DataTypes.STRING,
    purchaseAmount: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};