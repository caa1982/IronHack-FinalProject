const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');
const Poloniex = require('poloniex-api-node');


/* EDIT/ADD Settings. */
router.post('/', (req, res) => {
    console.log("hi", req.body);
    if (req.body.ticker === "poloniex") {
        Users.findById(req.user._id, function (err, user) {
            let poloniex = new Poloniex(user.PoloniexKeyAPI, user.PoloniexSecretAPI);
            poloniex.returnBalances(function (err, data) {
                res.json(data);
            })
        });
    }
    else if (req.body.order === "buy") {
        console.log("hi there Buy");
         Users.findById(req.user._id, function (err, user) {
            let poloniex = new Poloniex(user.PoloniexKeyAPI, user.PoloniexSecretAPI);
            let ticker = "BTC_"+(req.body.ticker.toUpperCase());
            let price = req.body.price;
            let qty = req.body.qty;
            console.log(ticker)
            poloniex.buy(ticker, price, qty, null, null, null, function(err, data){
                console.log(data)
                res.json(data);
            });
        });
    }
    else if (req.body.order === "sell") {
        console.log("hi there sell");
    }
})

module.exports = router;