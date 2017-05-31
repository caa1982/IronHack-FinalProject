var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();

//add your secret key, you can use www.random.org
jwtOptions.secretOrKey = 'NAQB13amtqdVOMjy92TY';

module.exports = jwtOptions;