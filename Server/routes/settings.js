const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../model/user');
const passport = require('../config/passport');
const jwtDecode = require('jwt-decode');

/* EDIT/ADD Settings. */
router.post('/', (req, res) => {

  const apiKeys = {
    PoloniexKeyAPI: req.body.PoloniexKeyAPI,
    PoloniexSecretAPI: req.body.PoloniexSecretAPI,
    BittrexKeyAPI: req.body.BittrexKeyAPI,
    BittrexSecretAPI: req.body.BittrexSecretAPI
  }

  Users.findByIdAndUpdate(req.user._id, apiKeys, { new: true }, (err, user) => {

    if (err) {
      return res.send(err);
    }

    return res.json({
      user
    });

  });
});

module.exports = router;