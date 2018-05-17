var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

// Creates a "portfolioPurchase" model that matches up with DB
var portfolioPurchase = sequelize.define("newPurchase", {

    routeName: Sequelize.STRING,
   
    userId: Sequelize.INTEGER,
    
    coin: Sequelize.STRING,
    
    coinId: Sequelize.INTEGER,
    
    purchaseAmount: Sequelize.DECIMAL,
      
    currentCash: Sequelize.DECIMAL
}, {
        timestamps: true
    });

// Syncs with DB
portfolioPurchase.sync();

// Makes the portfolioPurchase Model available for other files (will also create a table)
module.exports = portfolioPurchase;