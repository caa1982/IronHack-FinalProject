const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Coin = require('../model/coin');



/* show Cointmarketcap */
router.get('/', (req, res) => {
    Coin.find({}, function (err, coin) {
        if (err) {
            res.status(500).json({ message: "DB error" });
        } else {
            res.status(200).json(coin);
        }
    }) 
})

module.exports = router;