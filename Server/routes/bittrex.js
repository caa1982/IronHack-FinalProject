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

    });

});

module.exports = router;