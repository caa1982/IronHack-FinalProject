const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');
const Poloniex = require('poloniex-api-node');

/* EDIT/ADD Settings. */
router.post('/', (req, res) => {

    Users.findById(req.user._id, function (err, user) {
        const poloniex = new Poloniex(user.PoloniexKeyAPI, user.PoloniexSecretAPI);

        if (req.body.input === "poloniex") {

            poloniex.returnBalances(function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === "buy") {
            const ticker = "BTC_" + req.body.ticker.toUpperCase();

            poloniex.buy(ticker, req.body.price, req.body.qty, null, null, null, function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === "sell") {
            const ticker = "BTC_" + req.body.ticker.toUpperCase();

            poloniex.sell(ticker, req.body.price, req.body.qty, null, null, null, function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === "open orders") {
            const ticker = "BTC_" + req.body.ticker.toUpperCase();

            poloniex.returnOpenOrders(ticker, function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === 'cancel order') {

            poloniex.cancelOrder(req.body.id, function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === "trade history") {
            const ticker = "BTC_" + req.body.ticker.toUpperCase();

            poloniex.returnMyTradeHistory(ticker, null, null, function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === "order book") {
            const ticker = "BTC_" + req.body.ticker.toUpperCase();

            poloniex.returnOrderBook(ticker, "10", function (err, data) {
                res.json(data);
            });

        } else if (req.body.order === "coins") {

            poloniex.returnCurrencies(function (err, data) {
                res.json(data);
            });
        } 
    });

});

module.exports = router;