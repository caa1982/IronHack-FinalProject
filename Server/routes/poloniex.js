const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');
const Poloniex = require('poloniex-api-node');


/* EDIT/ADD Settings. */
router.put('/', (req, res) => {
    console.log("hi")
  Users.findById(req.user._id, function (err, user) {
   let poloniex = new Poloniex(user.PoloniexKeyAPI, PoloniexSecretAPI);
   poloniex.returnBalances(function(err, data) {
       console.log(data)
   })
  }, (err) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      message: 'settings input successful'
    });
  });

})

module.exports = router;