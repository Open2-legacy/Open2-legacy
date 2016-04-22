(function() {

  angular 
    .module('myApp')
    // login controller
    .controller('chatCtrl', function($scope) { 

      $scope.username = localStorage.username;

      $scope.addThumb = function() {
        //FIELD VALUES
        var username = localStorage.username;
        var message = ':thumbsup:';  

        //SAVE DATA TO FIREBASE AND EMPTY FIELD
        var timeString = Date.parse(new Date()).toString();
        ref.push({name:username, text:message, time: timeString });
        messageField.val('');
      }

      // chat message input resize
      $(function() {
        $("#messageInput");
      })

      // REGISTER DOM ELEMENTS
      var messageField = $('#messageInput');
      var messageList = $('#messageContainer');

      // LISTEN FOR KEYPRESS EVENT
      messageField.keypress(function(e) {
        if ( e.keyCode == 13 ) {
          //FIELD VALUES
          var username = localStorage.username;
          var message = messageField.val();   

          //SAVE DATA TO FIREBASE AND EMPTY FIELD
          var timeString = Date.parse(new Date()).toString();
          if (message.length === 0) {
            alert('Message field cannot be empty.')
          } else {
            ref.push({name:username, text:message, time: timeString });
            messageField.val('');
          }
        }
      });

      $('#submit').on("click", function(){ 
        //FIELD VALUES
        var username = localStorage.username;
        var message = messageField.val();   

        //SAVE DATA TO FIREBASE AND EMPTY FIELD
        var timeString = Date.parse(new Date()).toString();
        if (message.length === 0) {
          alert('Message field cannot be empty.')
        } else {
          ref.push({name:username, text:message, time: timeString });
          messageField.val('');
        }
       });


      // Add a callback that is triggered for each chat message.
      ref.limitToLast(10).on('child_added', function (snapshot) {
        //GET DATA
        var data = snapshot.val();
        var username = data.name || 'anonymous';
        var message = data.text;
        var time = data.time ? new Date(Number(data.time)) : '';

        //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        if (username !== 'anonymous') {
          var singleMessage = $("<div class='message-single'></div>");
          var messageElement = $("<p></p>");
          var nameElement = $("<strong class='example-chat-username'></strong>:");
          var timeElement = $("<span class='time'></span>");

          nameElement.text(username + ': ');
          timeElement.text(moment(time).format("ddd, h:mm:ss a"));
          messageElement.text(message);

          emojify.run(messageElement[0]);

          singleMessage.prepend(nameElement).append(timeElement).append(messageElement);

          //ADD MESSAGE
          messageList.append(singleMessage)
        }

        //SCROLL TO BOTTOM OF MESSAGE LIST
        messageList[0].scrollTop = messageList[0].scrollHeight;
      });


      function makeChat(authData) { 
        var chat = new Firechat(ref);
        chat.setUser(authData.auth.uid, authData.auth.username, function(user) {
          chat.resumeSession();
        });
      }

      $scope.login = function() {
        ref.authWithCustomToken(localStorage.firebaseToken, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Login Succeeded!", authData);
            makeChat(authData);
          }
        });
      }
      
    })

})();
