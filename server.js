var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var exphbs = require('express-handlebars');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8080;

var db = require("./models");

app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    name: 'user',
    saveUninitialized: true,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

// setup rendering engine
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

require('./routes/htmlRoutes')(app);
require('./routes/transactions')(app);
require('./routes/users')(app, passport);
require('./config/passport')(passport, db.User);

require('dotenv').config();

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});

module.exports = {app: app, db: db};