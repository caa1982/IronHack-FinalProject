var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Users = require('../model/user');
const upload = require('../config/multer');
const passport = require('../config/passport');
var jwtDecode = require('jwt-decode');

/* EDIT Settings. */
router.put('/', (req, res) => {
  console.log("request", req.user._id)
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