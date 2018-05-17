module.exports = function(app){

	app.get("/oauth2callback", (req, res) => {
		require("../config/google.js")()
			.catch(err => send(err))
	});
}