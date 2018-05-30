var express = require('express');
var db = require('../models');

module.exports = function (app, passport) {

    app.get("/index", function (req, res) {
        res.render("index");
    });

    app.get("/logout", function (req, res) {
        req.session.destroy(function (err) {
            res.redirect("/");
        });
    });

    app.get("/profile", function (req, res) {
        res.render("profile");

    });


    app.get("/authSuccess", function (req, res) {
        res.redirect("/profile/" + req.user.id);
    });

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
            res.redirect('/profile');
        });
            
    // POST ROUTES
    // route for saving a new purchase
    app.post("/api/transactions", function(req, res) {
        console.log(req.body);
        db.Transaction.create({
            coin: req.body.coin,
            coinId: req.body.coinId,
            purchasePrice: req.body.purchasePrice,
            purchaseAmount: req.body.purchaseAmount,
            UserId: req.session.passport.user
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });     

    // Get user profile info
    app.get("/api/user", (req, res) => {
        db.User.findOne({
            where: {
                id: req.session.passport.user
            }
        }).then(function (user) {
            return user;
        });
    });
}