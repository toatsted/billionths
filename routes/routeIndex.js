var express = require('express');
var router = express.Router();

module.exports = function(router){
		
	router.get("/", (req, res, next) => {
		res.render("index");
	})

	router.get('/transactions', (req, res, next) => {
		res.render("transactions");
	})

	router.get("/index", (req, res, next) => {
		res.render("dashboard");
	})

	router.get("/contact", (req, res, next) => {
		res.render("contact");
	})
	
}