var express = require('express');
var db = require('./db.js');
var cors = require('cors');
var bodyParser = require('body-parser');
var router = express.Router();
var bcrypt = require('bcrypt');
var signup = require('./signup.js');
var helper = require('./helpers.js');
var auth = require('./auth.js');
var app = express();
app.use(cors());

//checks username and password
router.post('/homepage', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var uid;
  helper.auth(username, password).then(function(resp){
    var result = false;
    if(resp[0].username===username && bcrypt.compareSync(password, resp[0].password)){
        uid=resp[0].id;
        console.log('uid*******',uid);
        result = true;
      
      }
    if (result){
      console.log(resp[0])
      res.json({
          username : username,
          user_id : uid,
          success : true,
          message : 'you are logged in',
          token : auth.genToken(resp[0]),
          firebaseToken : auth.genFirebaseToken({'uid': resp[0].id, 'username': resp[0].username})
      });
    } else {
        res.json({
          success : false,
          message : 'invalid username and password'
        });
      }
  }).catch(function(err){
    console.log('unexpected error: ', err);
  });
});

module.exports = router;
