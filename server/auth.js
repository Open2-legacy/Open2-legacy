var jwt = require('jsonwebtoken');
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator('NWM1ahIsr2Ltt19nD7YseRpmHUldzAVB15jdsf27');

var tokenSecret = 'CouchBase35';
var decode = module.exports.decode = function(token){
	return jwt.decode(token);
};

var genToken = module.exports.genToken = function(userObj){
	return jwt.sign({ID: userObj.ID, username: userObj.username}, tokenSecret, {
		expiresIn: 100000
	});
};	

var genFirebaseToken = module.exports.genFirebaseToken = function(userObj){
	return tokenGenerator.createToken({"uid": "+userObj.ID+", "username": userObj.username});
}

var ifAuthorized = module.exports.ifAuthorized = function(req, res, next) {
	var token = req.headers['x-access-token'];
	var verify;

	if(token) {
		jwt.verify(token, tokenSecret, function(err, decoded){
			if(err){
				unauthorized(res);
			} else{
				next();
			}
		})
	} else {
		unauthorized(res);
	}


function unauthorized(res){
	res.json({
		success : false,
		message : 'Unauthorized, token missing or invalid'
		})
	}
}
