// Require NewPurchase model
var db = require("../models");

module.exports = function(app){
	// GET route for getting all of the holdings
	app.get("/api/holdings", function (req, res) {
		// findAll returns all entries for a table when used with no options
		db.NewPurchase.findAll({}).then(function (dbNewPurchase) {
			// We have access to the todos as an argument inside of the callback function
			res.json(dbNewPurchase);
		});
	});

	// POST route for saving a new purchase
	app.post("/api/holdings", function (req, res) {
		console.log(req.body);
		// create takes an argument of an object describing the item we want to
		// insert into our table. In this case we just we pass in an object with a text
		// and complete property (req.body)
		db.NewPurchase.create({

			userId: req.body.userId,

			coin: req.body.coin,

			coinId: req.body.coinId,

			purchasePrice: req.body.purchasePrice,

			purchaseAmount: req.body.purchaseAmount,

			currentCash: req.body.currentCash

		}).then(function (dbNewPurchase) {
			// We have access to the new todo as an argument inside of the callback function
			res.json(dbNewPurchase);
		});
	});

	// DELETE route for deleting purchases. We can get the id of the purchase we want to delete from
	// req.params.id
	app.delete("/api/holdings/:id", function (req, res) {
		
		db.NewPurchase.destroy({		
			where: {
				id: req.body.id
			}
		}).then(function (dbNewPurchase) {
			res.json(dbNewPurchase);
		});
	});

	// PUT route for updating purchases. We can modify the amount of crypto holdings
	app.put("/api/holdings", function (req, res) {

		db.NewPurchase.update({

			userId: req.body.userId,

			coin: req.body.coin,

			coinId: req.body.coinId,

			purchasePrice: req.body.purchasePrice,

			purchaseAmount: req.body.purchaseAmount,

			currentCash: req.body.currentCash

		}, {
			where: {
				id: req.body.id
			}
		}).then(function(dbNewPurchase) {
			res.json(dbNewPurchase);
		});
	});

	// Authentication route
	app.get("/oauth2callback", (req, res) => {
		require("../config/google.js")()
			.catch(err => send(err))
	});
}