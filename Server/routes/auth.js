const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwtOptions');

// Our user model
const User           = require("../model/user");

// Bcrypt let us encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


router.post("/login", function(req, res) {

  if(req.body.email && req.body.password){
    var email = req.body.email;
    var password = req.body.password;
  }

  if (email === "" || password === "") {
    res.status(401).json({message:"Please fill up all the fields"});
    return;
  }

  User.findOne({ "email": email }, (err, user)=> {

  	if( ! user ){
	    res.status(401).json({message:"no such user found"});
	  } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          res.status(401).json({message:"passwords did not match"});
        } else {
        	console.log('user', user);
          var payload = {id: user._id, user: user.email};
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          console.log(token)
          res.json({message: "ok", token: token, user: user});
        }
      });
    }
  })
});

router.post("/signup", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;

  if (!email || !password || !name === "") {
    res.status(400).json({ message: "Please provide email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'user exist' });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      email,
      name,
      password: hashPass
    });

    newUser.save((err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        var payload = {id: user._id, user: user.email};

        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({message: "ok", token: token, user: user});
      	// res.status(200).json(user);
      }
    });
  });
});



module.exports = router;
