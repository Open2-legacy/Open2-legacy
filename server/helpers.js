var db = require('./db.js');
function doesUserExist(user){
  return new Promise(function(resolve, reject) {
    db.query('SELECT username FROM Users', function(err,rows){
      resolve(rows);
    });
  });
}

function insertUser(user) {
  return new Promise(function(resolve, reject){
    db.query('INSERT INTO Users SET ?', user, function (err, results){
      console.log('this is insertuser results',results);
      resolve(results);
    });
  });
}

function auth(user, pw){
  return new Promise(function(resolve, reject){
    db.query('SELECT * FROM Users WHERE username = ?',[user],function(err, query){
      resolve(query);
    });
  });
}

function getUserId(username){
  return new Promise(function(resolve, reject){
    db.query('SELECT * FROM Users Where `username` = ?;', [username], function(err,query){
      resolve(query);
    });
  });
}

function checkUserEvent(userid,eventid,status){
  return new Promise(function(resolve,reject){
    db.query('SELECT * FROM UserEvents WHERE `user_id`=? AND `event_id`=? AND `created_by`=?;',[userid,eventid,status],function(err,rows){
      resolve(rows);
    });
  });
}

function insertEvent(userid, eventid, status){
  console.log('inside insert event:');
  return new Promise(function(resolve, reject){
    db.query('INSERT INTO UserEvents (`user_id`,`event_id`,`created_by`) VALUES ('+userid+', '+eventid+', '+status+');', function(err,query){
      resolve(query);
    });
  });
}

function removeUserEvent(eventId, userId){
  return new Promise(function(resolve, reject){
    db.query('DELETE FROM UserEvents Where `event_id` = ? AND `user_id` = ?;',[eventId, userId], function(err,query){
      resolve(query);
    });
  });
}

function getAllUserEvents(){
  return new Promise(function(resolve, reject){
    // console.log('this is the userid in helper:', userid);
    db.query('SELECT * FROM UserEvents', function(err, query){

      resolve(query);
    });
  });
}

function getAllEvents(){
  return new Promise(function(resolve, reject){
    // console.log('this is the userid in helper:', userid);
    db.query('SELECT * FROM Events', function(err, query){
      resolve(query);
    });
  });
}

// db.query('SELECT * FROM UserEvents LEFT JOIN Events ON `UserEvents`.`event_id`=`Events`.`id`', function(err, query){
//       resolve(query);
//     });

// original getAllUserEvents query...
// function getAllUserevents(userid,eventid){
//   return new Promise(function(resolve, reject){
//     console.log('this is the userid in helper:', userid);
//     db.query('SELECT * FROM UserEvents INNER JOIN Events ON `UserEvents`.`event_id`=`Events`.`id`' , function(err, query){
//       resolve(query);
//     });
//   });
// }

// function getEventById(eventid) {
//   return new Promise(function(resolve,reject) {
//     db.query('SELECT * FROM UserEvents Where `event_id`=?;',[eventid],
//       function(err, query) {
//         resolve(query);
//       })
//   });
//  }

module.exports= {
  doesUserExist : doesUserExist,
  insertUser : insertUser,
  auth : auth,
  getUserId : getUserId,
  insertEvent : insertEvent,
  checkUserEvent : checkUserEvent,
  removeUserEvent : removeUserEvent,
  getAllUserEvents : getAllUserEvents,
  getAllEvents: getAllEvents
};
