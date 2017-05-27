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
        const ticker = "BTC_" + (req.body.ticker.toUpperCase());
        const price = req.body.price;
        const qty = req.body.qty;

        if (req.body.ticker === "poloniex") {

            poloniex.returnBalances(function (err, data) {
                res.json(data);
            });

        }else if (req.body.order === "buy") {

            poloniex.buy(ticker, price, qty, null, null, null, function (err, data) {
                res.json(data);
            });

        }else if (req.body.order === "sell") {

            poloniex.sell(ticker, price, qty, null, null, null, function (err, data) {
                res.json(data);
            });
        }

    });

});

module.exports = router;