module.exports = function(app){
		
	app.get("/", (req, res) => {
		res.render("index");
	})

	app.get("/index", (req, res) => {
		res.render("index");
	})

	app.get("/profile", (req, res) => {
		res.render("profile");
	})

	app.get("/dashboard", (req, res) => {
		res.render("dashboard");

	app.get("/contact", (req, res) => {
		res.render("contact");
		})

		app.get("/about", (req, res) => {
			res.render("about");
			})
	})

}