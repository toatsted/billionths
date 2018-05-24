var db = require("../models");
var passport = require("passport");
var fs = require('fs');

var app = require('../config/app');

module.exports = function (apiRoutes) {
	// Authentication route
	app.get('/auth/google',
		passport.authenticate('google', {
		scope: [
			'profile',
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/plus.me"
		]
	}));


	app.get('/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/login'
		}),
		function (req, res) {
			res.redirect('/');
		});

	// Get user profile info
	app.get("/api/User/:id", function (req, res) {
		db.User.find({
			where: {
				id: req.params.userId
			}
		}).then(function (dbUser) {
			// We have access to the todos as an argument inside of the callback function
			res.json(dbUser);
		})
	});

	// GET route for getting all of the Transaction
	app.get("/api/User/Transaction", function (req, res) {
		// findAll returns all entries for a table when used with no options
		db.User.findAll({
			include: [{
				model: Transaction
			}]
		}).then(function (dbTransaction) {
			// We have access to the todos as an argument inside of the callback function
			res.json(dbTransaction);
		});
	});

	// Get route for getting a specific transaction
	app.get("/api/User/Transaction/:id", function (req, res) {

		db.Transaction.findOne({
			where: {
				id: req.params.id
			}
		}).then(function (transaction) {
			return transaction;
		});
	});

	// Get route for getting total number of a secific coin
	app.get("/api/User/Transaction/:coin", function (req, res) {
		db.Transaction.findAll({
			where: {
				coin: req.params.coin
			}
		}).then(function (coinTotal) {
			return coinTotal;
		});
	});



	// ===========================================
	// Transaction page
	// ===========================================
	// POST route for saving a new purchase
	app.post("/api/User/Transaction", function (req, res) {
		
		db.Transaction.create({
			coin: req.body.coin,
			coinId: req.body.coinId,
			purchasePrice: req.body.purchasePrice,
			purchaseAmount: req.body.purchaseAmount
		}).then(function (dbTransaction) {
			// We have access to the new transaction as an argument inside of the callback function
			res.json(dbTransaction);
		});
	});

	// POST route for creating a new user
	app.post(`/api/newUser`, function (req, res) {
		db.User.create({
			username: req.body.username,
			userId: req.body.userId,
			money: req.body.money
		});
	});

	// GET route for pulling user info
	app.post('/api/userLogin', (req, res) => {
		console.log("In the get command")
		console.log(req.body)

		db.User.findAll({
			where: {
				id: req.body.loginID
			}
		}).then(function(dbUser){
			res.json(dbUser);
		})
	})




	// delete route for devaring purchases. We can get the id of the purchase we want to delete from
	// req.params.id
	app.delete("/api/User/Transaction/:id", function (req, res) {

		db.Transaction.destroy({
			where: {
				id: req.params.transaction_id
			}
		}).then(function (dbTransaction) {
			res.json(dbTransaction);
		});
	});

	// delete the entire User transaction history, for when creating new game
	app.delete("/api/User/Transaction", function (req, res) {

		db.Transaction.destroy({
			include: [{
				model: User
			}]
		}).then(function (dbTransaction) {
			res.json(dbTransaction);
		});
	});

	// PUT route for updating Transaction. We can modify the amount of crypto Transaction
	app.put("/api/User/Transaction/:id", function (req, res) {

		db.Transaction.update({

			coin: req.body.coin,

			coinId: req.body.coinId,

			purchasePrice: req.body.purchasePrice,

			purchaseAmount: req.body.purchaseAmount

		}, {
				where: {
					id: req.body.id
				}
			}).then(function (dbTransaction) {
				res.json(dbTransaction);
			});
	});

}