let express = require("express");
let exphbs = require("express-handlebars");
let bodyParser = require("body-parser");

// configure env variables
require("dotenv").config();

// import all models into db
let db = require("./models");

let PORT = process.env.PORT || 8080;
let app = express();

// create static routes to all files in /public
app.use(express.static("public"));

// parse body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup rendering engine
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// attach db to req obj in routes
app.use((req, res, next) => {
	req.db = db;
	next();
})

// routing
require("./routing/api-routes")(app);
require("./routing/html-routes")(app);

// sync models and listen
db.sequelize.sync({force: true})
	.then(() => {
		app.listen(PORT, () => 
			console.log(`app is listening on PORT ${PORT}`))
	})
