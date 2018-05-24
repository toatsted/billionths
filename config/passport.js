var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var fs = require('fs');

var db = require('../models');
var app = require('../app')(app);

module.exports = function(passport) {
    // configure express to use passport	
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        user.findById (id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
    	    clientID: "480019328973-svpoqjokmkhv8s90kmhmt4qqvctbaco3.apps.googleusercontent.com",
    	    clientSecret: "eYmY_xcGcq79qSQj28FEWjrF",
    	    callbackURL: "/auth/google/callback",
    	    proxy: true
    	},
            function (accessToken, refreshToken, profile, done) {
                user.findOrCreate({
                    id: profile.id
            }, function (err, user) {
                    return done(err, user);
            });
        }
    ));

}