const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');

console.log("test")

/* EDIT/ADD Settings. */
router.post('/', (req, res) => {
  console.log("hi", req.user._id)
  Users.findByIdAndUpdate(req.user._id, {
    PoloniexKeyAPI: req.body.PoloniexKey,
    PoloniexSecretAPI: req.body.PoloniexSecret,
    BittrexKeyAPI: req.body.BittrexKey,
    BittrexSecretAPI: req.body.BittrexSecret,
    KrakenKeyAPI: req.body.KrakenKey,
    KrakenSecretAPI: req.body.KrakenSecret
  });

})

module.exports = router;