module.exports = function(app){

	app.get("/account", (req, res) => {
		require("../config/google.js")()
			.catch(err => send(err))
	});
}