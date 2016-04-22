var express = require('express');
var db = require('./db.js');
var cors = require('cors');
var bodyParser = require('body-parser');
var twilio = require('twilio')('AC40691c0816f7dd360b043b23331f4f43','89f0d01b69bb6bcc473724b5b232b6f4');
var router = express.Router();
var helper = require('./helpers.js');

var app = express();
app.use(cors());

router.post('/events', function(request, response) {
  console.log('inside dashboard username', request.body.username);
  var event = request.body.event;
  var timestamp = request.body.time;
  var username = request.body.username;

  var events = {eventname: event, timestamp: timestamp};

  //this will send a text message to the "to" user;
  //get twilio trial account to get a phone number which sends texts from "from"
  twilio.sendMessage({
    to: '+1************',
    from: '+1**********',
    body: 'I am available to ' + event + " at " + timestamp
  });


  db.query('INSERT INTO Events SET ?', events, function(err, results){
    if (err) {
      response.sendStatus(500);
    }else{
      var eventId = results.insertId;
     //what is results.insertId? from table? 

      db.query('SELECT * FROM Events WHERE `id` = ?;', [eventId], function(err, rows){
        if(err){
          throw err;
        }else{
          response.send(rows);

          db.query('SELECT * FROM Users WHERE `username` = ?;', [username], function(err, rows) {
            if(err){
              throw err;
            }else{
              var userId = rows[0].id;

              addUserEvents(userId, eventId, true);
            }
          });
        }
      })
    }
  });
})

//insert body.user and eventid, and status into userEvents table
var addUserEvents = function(creator, eventId, status){
  var userEvents = {user_id: creator, event_id: eventId, created_by: status};
  console.log(userEvents)
  db.query('INSERT INTO UserEvents SET ?', userEvents, function(err, results){
    if (err) {
      console.log(err);
    }else{
      console.log("Add User Events", results);
    }
  });
}

//upon get upload, sending the whole row of username, eventname, timestamp, etc.... omg
router.get('/upload', function(request, response){

  db.query('SELECT Users.username, Events.eventname, Events.timestamp, UserEvents.id, UserEvents.created_by FROM Users INNER JOIN UserEvents ON Users.id = UserEvents.user_id INNER JOIN Events ON Events.id = UserEvents.event_id ORDER BY event_id', function(err, rows){
    if(err){
      throw err;
    }else{
      // console.log("query from database", rows);
      response.send(rows);

    }
  })

})

//upon get friends send users including the client(need fix) from user table and send back. 
router.get('/friends', function(request, response){
  db.query('SELECT username FROM Users', function(err, results){
    if(err){
      throw err;
    }else{
      // console.log("friends list from db", results);
      response.send(results);
    }
  })
})

//need to make function grabbing body username
//query user table for this username and get ID
//query userevents table for body event id, set event id to event id from userevents table
//insert userid, join event id into user events table
//what's the point of this? 
//todo: need to understand what this post is doing
//helper functions:
router.post('/join', function(req, res){
  var username = req.body.user;
  var eventid = req.body.eventId;
  var userid;
  
  helper.getUserId(username)
  .then(function(resp){
    userid = resp[0].id;
    return resp[0].id;
    })
  .then(function(resp){
    helper.checkUserEvent(resp,eventid,false)
    .then(function(resp){
    return resp;
    })
  .then(function(resp){
    if(resp.length !== 0){
      console.log('inside join if');
      res.json({
          username : username,
          success : false,
          message : 'that event already exist!'
          });
    } else {
      console.log('inside join else');
      helper.insertEvent(userid,eventid,false)
      .then(function(){
        res.json({
          username : username,
          userid : userid,
          eventid: eventid,
          success : true,
          message : 'you joined the event'
          })
        });
      }
    })
  })
})

router.post('/unjoin',function(req,res){
    var userEventId=req.body.eventid;
    console.log('this is the request: ', req.body);
    helper.removeUserEvent(userEventId).then(function(resp){
      console.log('this is unjoin resp : ', resp);
      res.json({
        success : true,
        message : 'You unjoined the event'
      })

    })
})

module.exports = router;
