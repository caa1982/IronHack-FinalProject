const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');
const bittrex = require('node.bittrex.api');

/* EDIT/ADD Settings. */
router.post('/', (req, res) => {
    
    Users.findById(req.user._id, function (err, user) {
        bittrex.options({
            'apikey': user.BittrexKeyAPI,
            'apisecret': user.BittrexSecretAPI
        });

        if (req.body.order === "coins") {

            bittrex.getmarketsummaries(function (data) {
                res.json(data);
            });

        } else if (req.body.input === "bittrex") {
            
            bittrex.getbalances(function (data) {
                res.json(data);
            });

        } else if (req.body.order === "open orders"){
            const ticker = "BTC-" + req.body.ticker.toUpperCase();

            bittrex.getopenorders(ticker, function(data){
                res.json(data);
            });

        } else if (req.body.order === 'cancel order'){
    
             bittrex.cancel({ Uuid : req.body.id }, function (data) {
                 console.log(data);
                res.json(data);
            });

        } else if (req.body.order === 'buy'){
            const ticker = "BTC-" + req.body.ticker.toUpperCase();
    
             bittrex.buylimit({ market : ticker, quantity : req.body.qty, rate : req.body.price }, 
             function (data) {
                res.json(data);
            });

        } else if (req.body.order === 'sell'){
            const ticker = "BTC-" + req.body.ticker.toUpperCase();
    
             bittrex.buylimit({ market : ticker, quantity : req.body.qty, rate : req.body.price }, 
             function (data) {
                res.json(data);
            });

        } 

    });

});

module.exports = router;