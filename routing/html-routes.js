module.exports = function(app){
		
	app.get("/", (req, res, next) => {
		res.render("index");
	})

	app.get('/transactions', (req, res, next) => {
		res.render("transactions");
	})

	app.get("/index", (req, res, next) => {
		res.render("dashboard");
	})

	app.get("/contact", (req, res, next) => {
		res.render("contact");
	})
	
}