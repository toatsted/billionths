var express = require('express');
var router = express.Router();

var User = require("../models/user");
var passport = require('../config/passport');

module.exports = function (router) {
    
    router.get('/auth/google',
	    passport.authenticate('google', {
	        scope: [
	            'profile',
	            "https://www.googleapis.com/auth/plus.login",
	            "https://www.googleapis.com/auth/plus.me"
	        ]
	    }));


	router.get('/auth/google/callback',
	    passport.authenticate('google', {
	        failureRedirect: '/login'
	    }),
	    function (req, res) {
	        res.redirect('/');
	    });

	// Get user profile info
	router.get("/api/User/:id", function (req, res) {
	    db.User.find({
	        where: {
	            id: req.params.userId
	        }
	    }).then(function (dbUser) {
	        // We have access to the todos as an argument inside of the callback function
	        res.json(dbUser);
	    })
    });
}