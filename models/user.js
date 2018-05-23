'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    userId: DataTypes.STRING,
    money: DataTypes.FLOAT
  }, {});
  User.associate = function(models) {
    models.User.hasMany(models.Transaction);
};
  return User;
};