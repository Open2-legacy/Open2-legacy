(function() { 

angular
  .module('myApp')
  // dashboard controller
  .controller('dashboardCtrl', function($rootScope, $scope, Services,$mdDialog, $mdMedia, $route, $sce) {

  $rootScope.bodyClass = "whitebg";

  $scope.events = {};
  $scope.expand1 = false;

  //created user filter
  $scope.userFilter = function(item) {
    return (item.username !== localStorage.getItem('username'));
  }

  $scope.myEventFilter = function(item) {
    return (item.createdBy === 1);
  }


  $scope.toggleExpand = function(n) {
    var toggleStatus = !$scope['expand' + n];
    $scope['expand' + n] = toggleStatus;
    $scope['toggled' + n] = toggleStatus;
  }

  //// start uploading dashboard
  Services.uploadDashboard()
  .then(function(data){
    $scope.events.fetch = true;
    var myEvents = [];
    var eventsToJoin = [];

      // creating list of the events that current user attends or created himself
    data.forEach(function(item) {
      //console.log('this is an event item: ', item);
      // console.log('this is myevents array: ', myEvents);
      if(item.username===localStorage.getItem('username') && item.created_by === 0) {
        myEvents.push(
         {
          'eventname': item.eventname,
          'id': item.id,
          'timestamp': item.timestamp,
          'username': item.username,
          'createdBy': item.created_by,
          'status': 'unjoin',
          });
      }
      else if (item.username=== localStorage.getItem('username') && item.created_by ===1 ) {
        myEvents.push({
          'eventname': item.eventname,
          'id': item.id,
          'timestamp': item.timestamp,
          'username': item.username,
          'createdBy': item.created_by,
          'status': 'created by me'

        });
       }
    });


     // creating the list of events that are created by the user's friends, but aren't joined by the user
    data.forEach(function(item) {
     if (item.username !== localStorage.getItem('username') && item.created_by === 0) {
      if (item.eventname === 'Go hiking') {
        console.log(moment(Date.parse(item.timestamp)).utcOffset("-07:00").format('MMMM Do YYYY, h:mm:ss a'));
      }
       eventsToJoin.push({
        'eventname': item.eventname,
        'id': item.id,
        'timestamp': item.timestamp,
        'username': item.username,
        'createdBy': item.created_by,
        'status': 'join'
      });
      }
    });

  $scope.events.list = eventsToJoin;
  $scope.events.eventsIgoTo = myEvents;



}); // end of .then

////////////////end of uploading dashboard

 
// join or unjoin event

$scope.join = function(event) {
  console.log('event =', event);
  // console.log('id =',id, 'status=', status)
     //join
  console.log('event.status', event.status)
  if (event.status === 'join') {

    var joinInfo = {
      'eventname': event.eventname,
      'timestamp': event.timestamp,
      'username': event.username,
      'createdBy': event.createdBy,
      'eventId': event.id,
      'user': localStorage.getItem('username')
    };
    
    Services
    .joinEvent(joinInfo, $scope.events.eventsIgoTo)
    .then(function(resp) {
      console.log('event resp', resp);
      // console.log('eventsIgoto', $scope.events.eventsIgoTo);
      $scope.getEvents.push(resp.data);
    });
    // $route.reload();
  }
};

// new one, revert to old one if doesnt work.
// $scope.getEvents = [];
// Services.getEvents().then(function(response){
//   $scope.getEvents = response;
//   // console.log('this is a users events', $scope.getEvents);
// });

$scope.unjoinEvent = Services.unjoinEvent;

Services.uploadFriendslist()
.then(function(data){
  //console.log("friendslist i got from server ", data.data)
  $scope.friends = data.data;
});

// $scope.getAllEvents = Services.getAllEvents();
// $scope.getAllUserEvents = Services.getAllUserEvents();



  //this is our pop up dialog box
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/dashboard/dashboardEvent.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };
  //this the end of our pop up dialog box.

 
  $scope.time = {
    value: new Date(2016, 3, 9)
  };  //end of our time selector

 
  $scope.click = function() {
    var eventInfo = {
      'event' : $scope.user.activity,
      'time' : $scope.time.value,
      'username': localStorage.getItem('username')
    };
     
    Services.eventsPost(eventInfo)
    .then(function(respData){
      //console.log('i got this back from server/database', respData);
      location.reload();
    });
  };

})

/// this reversed the order of the events displayed on dashboard
// .filter('reverse', function() {
//   return function(items) {
//     return items.slice().reverse();
//   };
// });


function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}


})(); ///////// end of dahboard controller
