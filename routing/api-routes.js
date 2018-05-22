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


module.exports = function(app){

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
		callbackURL: "https://billionths.herokuapp.com/auth/google/callback",
	},
		function (accessToken, refreshToken, profile, done) {
			User.findOrCreate({ 
				username: profile.displayName,
				userId: profile.id
			}, function (err, User) {
				return done (err, User);
		});
	}));
		

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

	app.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/' }),
		function (req, res) {
			// Successful authentication, redirect to profile.
			res.redirect('/profile');
		});


	// GET route for getting all of the transactions
	app.get("/api/User/transactions", function (req, res) {
		// findAll returns all entries for a table when used with no options
		db.User.findAll({
			include: [{
				model: transactions
			}]
		}).then(function (dbtransactions) {
			// We have access to the todos as an argument inside of the callback function
			res.json(dbtransactions);
		});
	});

	// Get route for getting a specific transaction
	app.get("/api/User/transactions/:id", function (req, res) {

		db.transactions.findOne({
			where: {
				id: req.params.id
			}
		}).then( function (transaction) {
			return transaction;
		});
	});

	// Get route for getting total number of a secific coin
	app.get("/api/User/transactions/:coin", function (req, res) {
		db.transactions.findAll({
			where: {
				coin: req.params.coin
			}
		}).then(function (coinTotal) {
			return coinTotal;
		});
	});

	// POST route for saving a new purchase
	app.post("/api/User/transactions", function (req, res) {

		db.transactions.create({

			coin: req.body.coin,

			coinId: req.body.coinId,

			purchasePrice: req.body.purchasePrice,

			purchaseAmount: req.body.purchaseAmount

		}).then(function (dbtransactions) {
			// We have access to the new transaction as an argument inside of the callback function
			res.json(dbtransactions);
		});
	});

	// DELETE route for deleting purchases. We can get the id of the purchase we want to delete from
	// req.params.id
	app.delete("/api/User/transactions/:id", function (req, res) {
		
		db.transactions.destroy({		
			where: {
				id: req.params.id
			}
		}).then(function (dbtransactions) {
			res.json(dbtransactions);
		});
	});

	// Delete the entire User transaction history, for when creating new game
	app.delete("/api/User/transactions", function (req, res) {

		db.transactions.destroy({
			include: [{
				model: User
			}]
		}).then(function(dbtransactions) {
			res.json(dbtransactions);
		});
	});

	// PUT route for updating transactions. We can modify the amount of crypto transactions
	app.put("/api/User/transactions/:id", function (req, res) {

		db.transactions.update({

			coin: req.body.coin,

			coinId: req.body.coinId,

			purchasePrice: req.body.purchasePrice,

			purchaseAmount: req.body.purchaseAmount

		}, {
			where: {
				id: req.body.id
			}
		}).then(function(dbtransactions) {
			res.json(dbtransactions);
		});
	});
}
