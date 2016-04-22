var express = require('express');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var cors = require('cors');
var bodyParser = require('body-parser');
var auth = require('./auth.js');

var router = express.Router();

var app = express();

app.use(cors());

router.post('/newuser', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var imageUrl = req.body.imageUrl;
  var hashedPass = bcrypt.hashSync(password, 10);
  var user = { username: username, password: hashedPass, imageUrl: imageUrl};
  var helper = require('./helpers.js');
  helper.doesUserExist(username).then(function(resp){
    console.log('this is the resp', resp);
    var result=false;
    resp.forEach(function(currentEl){
      if(currentEl.username===username){
          result=true;  
      }
    });
    if(result){
      console.log('user already exist');
      res.json({
          success : false,
          message : 'username already exists!'
      });
    } else {
        helper.insertUser(user).then(function(resp){
        res.json({
          success : ('/login'),
          message : 'User inserted into database',
          token : auth.genToken(user)
        });
        }).catch(function(err){
          console.log('err inserting user into database');
          });
      }
  }).catch(function(err){
      console.log('this is the err', err);
  });
});

module.exports = router;
