var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');

var db = require('../models');
var passport = require('./passport');

var app = express();

module.exports = function (app) {

// create static routes to all files in /public
app.use(express.static("public"));

// parse body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// attach db to req obj in routes
app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use(express.cookieParser());
app.use(express.session({
    secret: 'keyboard cat'
}));

app.use(app.router);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


}