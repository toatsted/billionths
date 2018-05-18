// Creates a "NewPurchase" model that matches up with DB

module.exports = function(sequelize, DataTypes) {

var NewPurchase = sequelize.define("NewPurchase", {
   
    userId: Sequelize.INTEGER,
    
    coin: Sequelize.STRING,
    
    coinId: Sequelize.INTEGER,

    purchasePrice: Sequelize.DECIMAL,
    
    purchaseAmount: Sequelize.DECIMAL,
      
    currentCash: Sequelize.DECIMAL
}, {
        timestamps: true
    });

    return NewPurchase;
};