var express = require('express');
var router = express.Router();

var User = require("../models/user");
var Transaction = require('../models/transaction');
var passport = require('../config/passport');

module.exports = function (router) {
    // ===========================================
    // Transaction page
    // ===========================================
    // GET ROUTES
    // route for getting all of the Transaction
    router.get("/api/User/Transaction", function (req, res) {
        // findAll returns all entries for a table when used with no options
        db.User.findAll({
            include: [{
                model: Transaction
            }]
        }).then(function (dbTransaction) {
            // We have access to the todos as an argument inside of the callback function
            res.json(dbTransaction);
        });
    });

    // Get route for getting a specific transaction
    router.get("/api/User/Transaction/:id", function (req, res) {

        db.Transaction.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (transaction) {
            return transaction;
        });
    });

    // Get route for getting total number of a secific coin
    router.get("/api/User/Transaction/:coin", function (req, res) {
        db.Transaction.findAll({
            where: {
                coin: req.params.coin
            }
        }).then(function (coinTotal) {
            return coinTotal;
        });
    });


    // POST ROUTES
    // route for saving a new purchase
    router.post("/api/User/Transaction", function (req, res) {

        db.Transaction.create({
            coin: req.body.coin,
            coinId: req.body.coinId,
            purchasePrice: req.body.purchasePrice,
            purchaseAmount: req.body.purchaseAmount
        }).then(function (dbTransaction) {
            // We have access to the new transaction as an argument inside of the callback function
            res.json(dbTransaction);
        });
    });

    // POST route for creating a new user
    router.post(`/api/newUser`, function (req, res) {
        db.User.create({
            username: req.body.username,
            userId: req.body.userId,
            money: req.body.money
        });
    });

    // GET route for pulling user info
    router.post('/api/userLogin', (req, res) => {
        console.log("In the get command")
        console.log(req.body)

        db.User.findAll({
            where: {
                id: req.body.loginID
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        })
    })



    // DELETE ROUTES
    // delete route for devaring purchases. We can get the id of the purchase we want to delete from
    // req.params.id
    router.delete("/api/User/Transaction/:id", function (req, res) {

        db.Transaction.destroy({
            where: {
                id: req.params.transaction_id
            }
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });

    // delete the entire User transaction history, for when creating new game
    router.delete("/api/User/Transaction", function (req, res) {

        db.Transaction.destroy({
            include: [{
                model: User
            }]
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });

    // UPDATE ROUTES
    // PUT route for updating Transaction. We can modify the amount of crypto Transaction
    router.put("/api/User/Transaction/:id", function (req, res) {

        db.Transaction.update({

            coin: req.body.coin,

            coinId: req.body.coinId,

            purchasePrice: req.body.purchasePrice,

            purchaseAmount: req.body.purchaseAmount

        }, {
            where: {
                id: req.body.id
            }
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });

}