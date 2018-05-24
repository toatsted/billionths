var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

var app = require('./config/app');

// configure env variables
require("dotenv").config();

// import all models into db
var db = require("./models");

var PORT = process.env.PORT || 8080;

// setup rendering engine
app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// routing
require("./routing/api-routes")(app);
require("./routing/html-routes")(app);

// sync models and listen
db.sequelize.sync({force:true})
	.then(() => {
		app.listen(PORT, () => 
			console.log(`app is listening on PORT ${PORT}`))
	})