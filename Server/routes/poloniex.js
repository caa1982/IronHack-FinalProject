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
  Users.findById(req.user._id, function (err, user) {
   let poloniex = new Poloniex(user.PoloniexKeyAPI, user.PoloniexSecretAPI);
   poloniex.returnBalances(function(err, data) {
       res.json(data);
   })
  });

})

module.exports = router;