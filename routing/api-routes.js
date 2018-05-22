// Require NewPurchase model
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
	passport.serializeUser(function (user, done) {
		done(null, user);
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
			}, function (err, user) {
				return done (err, user);
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
			// Successful authentication, redirect home.
			res.redirect('/profile');
		});

	// GET user from session


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
				id: req.params.id
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
}
