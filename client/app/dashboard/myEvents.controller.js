(function() { 

angular
  .module('myApp')
  // dashboard controller
  .controller('myEventsCtrl', myEventsCtrl);

  function myEventsCtrl(allEvents, $scope) {

    $scope.eventsImAttending = allEvents.getMyEvents();
    
    $scope.unjoin = allEvents.unjoin;
  }

})();
