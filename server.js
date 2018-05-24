var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');

var app = require('./app');

// configure env variables
require("dotenv").config();

// import all models into db
var db = require("./models");

var PORT = process.env.PORT || 8080;

// routing
require('./routes/routeIndex')(router);
require('./routes/users')(router);
require('./routes/transactions')(router);

// sync models and listen
db.sequelize.sync({force:true})
	.then(() => {
		app.listen(PORT, () => 
			console.log(`app is listening on PORT ${PORT}`))
	})