var express = require('express');
var user;

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

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    };

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
            user = req.user;

            res.redirect('/profile');
        });

    // Get user profile info
    app.get("/api/user", (req, res) => {
        res.send(user);
    });

}