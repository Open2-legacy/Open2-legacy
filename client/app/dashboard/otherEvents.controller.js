(function() { 

angular
  .module('myApp')
  // dashboard controller
  .controller('otherEventsCtrl', otherEventsCtrl);

  function otherEventsCtrl(allEvents, $scope) {

    // set up references to factory arrays
    $scope.otherEvents = allEvents.getOtherEvents();

    $scope.join = allEvents.join;
    
  }

})();
