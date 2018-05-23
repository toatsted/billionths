module.exports = function(app){
		
	app.get("/", (req, res) => {
		res.render("index");
	})

	app.get('/transactions', (req, res) => {
		res.render("transactions");
	})

	app.get("/index", (req, res) => {
		res.render("dashboard");

	app.get("/contact", (req, res) => {
		res.render("contact");
		})
	})
}