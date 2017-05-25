const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');

/* EDIT/ADD Settings. */
router.put('/', (req, res) => {
  Users.findByIdAndUpdate(req.user._id, {
    PoloniexKeyAPI: req.body.PoloniexKey,
    PoloniexSecretAPI: req.body.PoloniexSecret,
    BittrexKeyAPI: req.body.BittrexKey,
    BittrexSecretAPI: req.body.BittrexSecret,
    KrakenKeyAPI: req.body.KrakenKey,
    KrakenSecretAPI: req.body.KrakenSecret
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