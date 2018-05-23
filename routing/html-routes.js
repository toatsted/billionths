module.exports = function(app){
		
	app.get("/", (req, res, next) => {
		res.render("index");
		next();
	})

	app.get('/transactions', (req, res, next) => {
		res.render("transactions");
		next();
	})

	app.get("/index", (req, res, next) => {
		res.render("dashboard");
		next();
	})

	app.get("/contact", (req, res, next) => {
		res.render("contact");
		next();
	})
	
}