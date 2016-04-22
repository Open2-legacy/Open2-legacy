(function() { 

angular
  .module('myApp')
  /// factory for get/post requests
  .factory('Services', function($http, $window, $location) {
    var username;
    var baseUrl = 'http://localhost:8080/';
     // login
    var login = function(user) {
      var request={
        method : 'POST',
        url : baseUrl+'index/homepage',
        data : user
      }
      
      return $http(request).then(success, err);

      function success(resp){
        //send back username from serve, resp.data.username
        //send back firebase token 
        //store both.
        console.log('inside login front end', " ", resp);
        if(resp.data.token){
          saveUserInfo(resp.data.username,resp.data.token,resp.data.firebaseToken,resp.data.user_id);
          $location.path('/dashboard');
        }
        console.log(resp);
        return resp;
      }

      function err(err){
        console.log('this is err',err);
        $location.path('/login');
        return console.log(err);
      }
    };

    // logout
      var logout = function(){
        $window.localStorage.removeItem('jwtToken');
        delete $window.localStorage['jwtToken'];
        $location.path('/');
      };


    // signup
      var signup = function(user) {
        var request = {
        method : 'POST',
        url : baseUrl+'signup/newuser',
        data : user
      };
      
      return $http(request).then(success, err);
      
      function success(resp){
        console.log('inside signup ******************', resp.data.user_id)
        if(resp.data){
          console.log('this is resp.data',resp.data.user_id);

          //saveUserInfo(resp.data.username,resp.data.token,resp.data.firebaseToken,resp.data.user_id);

          $location.path('/login');
        }
        return resp;
      }

      function err(err){
        console.log('inside err');
        $location.path('/');
        return console.log(err);
        }
      }

      function saveUserInfo(username,token,firebaseToken,userid){
        //need to add firebase token in parameter
        $window.localStorage['username'] =username;
        $window.localStorage['jwtToken'] = token;
        $window.localStorage['firebaseToken'] = firebaseToken;
        $window.localStorage['userId'] = userid;
        //need to locate firebase token in local storage
      }

      function getToken(){
        return $window.localStorage['jwtToken'];
      }

      function getUserName(){
        return $window.localStorage['username'];
      }

      function getuserid(){
        return $window.localStorage['userId'];
      }

      function getfirebaseToken(){
        return $window.localStorage['firebaseToken'];
      }
     //need to get firebase token from local storage
     
     // get the event info from database 
    

      var uploadDashboard = function() {
        return $http({
          method: 'GET',
          url: 'http://localhost:8080/dashboard/upload',
        })
        .then(function(resp){
          //console.log("data in uploadDashboard", resp.data)
          return resp.data;
        });
      };


    //// Twillio notification
      var notify = function(sendText){
        return $http({
          method: 'POST',
          url: 'http://localhost:8080/dashboard',
          data: sendText
        })
        .then(function(data){
          console.log("Sent the Messages", data);
        })
        .catch(function(err){
          $location.path('/');
          console.log(err);
        })
      };

       
       // new event request
      var eventsPost = function(eventInfo) {
        //console.log('eventinfo inside events post', eventInfo);
        return $http({
          method: 'POST',
          url: 'http://localhost:8080/dashboard/events',
          data: eventInfo
        });
      };

       // get freinds list
      var uploadFriendslist = function() {
        return $http ({
          method: 'GET',
          url: 'http://localhost:8080/dashboard/friends'
        });
      };


     // add a record to database when user joins an event
      var joinEvent = function(event, eventsIgoTo) {
        console.log('event is', event)
          return $http({
            method: 'POST',
            url: 'http://localhost:8080/dashboard/join',
            data: event
          }).then(success,err);

          function success(resp){
            console.log('resp =', resp)
            console.log('Inside joinEvent resp.data =',resp.data);
            console.log('resp.config.data', resp.config.data)
            eventsIgoTo.push(resp.config.data);
          }

          function err(err){
            console.log(err);
          }
      };

      


     //remove the record of user from database// this isn't handled in the backend 
      var unjoinEvent = function(userEventId) {
        console.log('this is userEventID: ', userEventId);
          return $http({
             method: 'POST',
             url: 'http://localhost:8080/dashboard/unjoin',
             data: userEventId
          }).then(success,err);

          function success(resp){
            console.log(resp);
          }

          function err(err){
            console.log('this is the error: ', err);
          }
      };

      return {
        login: login,
        uploadDashboard: uploadDashboard,
        notify: notify,
        eventsPost: eventsPost,
        signup: signup,
        logout: logout,
        username: username,
        uploadFriendslist: uploadFriendslist,
        joinEvent: joinEvent,
        unjoinEvent: unjoinEvent
      };

  });
/// end of Services
})();
