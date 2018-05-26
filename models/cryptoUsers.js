module.exports = function (sequelize, DataTypes) {
    var Users = sequelize
    .define("User", {
        userName: DataTypes.STRING,
        money: DataTypes.INTEGER
        

    });
    return Users
}