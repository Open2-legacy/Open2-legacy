var express = require('express');
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator("NWM1ahIsr2Ltt19nD7YseRpmHUldzAVB15jdsf27");

var app = express();

app.use(express.static('public'));


app.get('/gettoken', function(req,res) {
  var token = tokenGenerator.createToken({ uid: "uniqueId1", username: "blop" });
  res.send(token);
})

app.listen(9000);