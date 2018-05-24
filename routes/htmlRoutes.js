var db = require("../models");

module.exports = function(app){
		
	router.get("/", (req, res) => {
		res.render("index");
	})

	router.get('/transactions', (req, res) => {
		res.render("transactions");
	})

	router.get("/index", (req, res) => {
		res.render("dashboard");
	})

	router.get("/contact", (req, res) => {
		res.render("contact");
	})

	app.get("/profile/:id", (req, res) => {
		db.User.findOne({
			where: {
				id: req.params.id
			},
			include: [{
				model: db.Transaction,				
			}]
		}).then(function (dbUser) {
			res.render("profile", {
				user: dbUser
			});
		}).catch((err) => {
			res.json(err);
		});
	});
}