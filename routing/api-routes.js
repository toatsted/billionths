var db = require("../models");
var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
let fs = require('fs');
let https = require('https');
let util = require('util');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);

console.log("THIS IS THE DB: " + db.Transaction)


module.exports = function (app) {

	// configure express to use passport	
	passport.serializeUser(function (User, done) {
		done(null, User);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	passport.use(new GoogleStrategy({
		clientID: "480019328973-svpoqjokmkhv8s90kmhmt4qqvctbaco3.apps.googleusercontent.com",
		clientSecret: "eYmY_xcGcq79qSQj28FEWjrF",
		callbackURL: "/auth/google/callback",
		proxy: true
	},
		function (accessToken, refreshToken, profile, err, done) {
			return done(err, profile);			
		}
	));


	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(session({
		secret: 'cookie_secret',
		name: 'kaas',
		store: new RedisStore({
			host: '127.0.0.1',
			port: 6379
		}),
		proxy: true,
		resave: true,
		saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	// Authentication route
	app.get('/auth/google',
		passport.authenticate('google', {
			scope: [
				'profile',
				"https://www.googleapis.com/auth/plus.login",
				"https://www.googleapis.com/auth/plus.me"
			]
		}));

	app.get('/auth/google/callback', async(res, req, next) => {
		await passport.authenticate('google', async (err, profile, res) => {
			if (profile === false) {
				res.redirect('/')
			} else {
				await User.findOrCreate('User', {
					username: profile.displayName,
					userId: profile.id
				});
				res.redirect('/profile')
			}
		}); 
	});
	//.then(function (req,res) {
	// $("#profileName").html(req.params.username);
	// $("#profileId").html(req.params.userId);


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




	// DELETE route for deleting purchases. We can get the id of the purchase we want to delete from
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

	// Delete the entire User transaction history, for when creating new game
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
