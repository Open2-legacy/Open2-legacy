(function() { 

angular
  .module('myApp')
  // dashboard controller
  .controller('hostedEventsCtrl', hostedEventsCtrl);

  function hostedEventsCtrl(allEvents, $scope) {

    // set up references to factory arrays
    $scope.hostedEvents = allEvents.getHostedEvents();
    
  }

})();
