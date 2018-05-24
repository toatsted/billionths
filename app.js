var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require("fs");

var db = require('./models');
var passport = require('./config/passport');

// Routes
var routes = require('./routes/routeIndex');
var users = require('./routes/users');
var transactions = require('./routes/transactions');

var app = express();

module.exports = function (app) {
    // parse body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
        
    // setup rendering engine
    app.set('views', path.join(__dirname, 'views'));
    app.engine("handlebars", exphbs({
        defaultLayout: "main"
    }));
    app.set("view engine", "handlebars");

    // attach db to req obj in routes
    app.use((req, res, next) => {
        req.db = db;
        next();
    });
    // create static routes to all files in /public
    app.use(express.static("public"));



    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'keyboard cat',
            saveUninitialized: true,
            resave: true
    }));

    app.use(app.Router());

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // App routes
    app.use('/', routes);
    app.use('/users', users);
    app.use('/transactions', transactions);

}