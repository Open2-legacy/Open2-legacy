(function() { 

angular
  .module('myApp')
  // dashboard controller
  .factory('allEvents', allEventsFactory);

  function allEventsFactory($http) {

    var allEvents = {}; // mapping of eventID: eventobj
    var eventsUserAttending = {}; // mapping of eventID : true

    var hostedEvents = []; // events the person is hosting
    var myEvents = []; // events the person is attending
    var otherEvents = []; // events the person is not involved with.

    init();

    return {
      getHostedEvents: getHostedEvents,
      getMyEvents: getMyEvents,
      getOtherEvents: getOtherEvents,
      removeFrom: removeFrom,
      addTo: addTo,
      join: join,
      unjoin: unjoin
    }

    // -----------------------------------

    function init() {
      getAllEvents().then(function(allEvents) {
        getAllUserEvents().then(function(allUserEvents) {
          processData(allEvents, allUserEvents);
        });
      });
    }

    /**
     *  Getters
     *
     */
    function getHostedEvents() {
      return hostedEvents;
    }

    function getMyEvents() {
      return myEvents;
    }

    function getOtherEvents() {
      return otherEvents;
    }

    /**
     *  Setters
     *
     */
    function removeFrom(index, collection) {
      return collection.splice(index, 1);
    }

    function addTo(event, collection) {
      collection.push(event);
    }

    /**
     *  Interact with Server
     *
     */
    function join(event, index) {

      var request = {
        eventId: event.id,
        userId: localStorage.userId,
        username: localStorage.username
      }

      return $http({
        method: 'POST',
        url: 'http://localhost:8080/dashboard/join',
        data: request
      }).then(success,err);

      function success(resp){
        console.log('index = ', index);
        addTo(event, myEvents);
        removeFrom(index, otherEvents);
        return resp;
      }

      function err(err){
        console.log('this is an error: ', err);
      }
    }

    function unjoin(event, index) {
      console.log('this is event: ', event);
        return $http({
          method: 'POST',
          url: 'http://localhost:8080/dashboard/unjoin',
          data: {
            eventId: event.id,
            userId: localStorage.userId
          }
        }).then(success,err);

        function success(resp){
          console.log(resp);
          removeFrom(index, myEvents);
          addTo(event, otherEvents);
        }

        function err(err){
          console.log('this is the error: ', err);
        }
    };

    /**
     *  Get State from Server and filter accordingly
     *
     */
    function getAllEvents() {
     var request = {
       method: 'GET',
       url: 'http://localhost:8080/dashboard/allEvents'
     };
     
     return $http(request).then(success, error);
     
     function success(response){
       return response.data.response;
     }

     function error(err){
       console.log('this is an error: ', err);
     }
    };

    function getAllUserEvents() {
     var request = {
       method: 'GET',
       url: 'http://localhost:8080/dashboard/allUserEvents'
     };
     
     return $http(request).then(success, error);
     
     function success(response){
        return response.data.response;
     }

     function error(err){
       console.log('this is an error: ', err);
     }
    }

    function processData(allPossibleEvents, allUserEvents) {
      _.forEach(allPossibleEvents, function(event) {
        allEvents[event.id] = event;
      });

      _.forEach(allUserEvents, function(event) {
        if (event.user_id === Number(localStorage.userId)) {
          eventsUserAttending[event.event_id] = true;
        }
      });

      var allMyEvents = _.filter(allUserEvents, function(event) {
        return event.user_id === Number(localStorage.userId);
      });

      var allMyEventsInfo = _.map(allMyEvents, function(event) {
        return allEvents[event.event_id];
      });

      var allOtherEvents = _.filter(allPossibleEvents, function(event) {
        return !eventsUserAttending[event.id];
      });

      var myHostedEvents = _.filter(allMyEvents, function(event) {
        return event.created_by === 1;
      });

      var myHostedEventsInfo = _.map(myHostedEvents, function(event) {
        return allEvents[event.event_id];
      });

      [].push.apply(myEvents, allMyEventsInfo);
      [].push.apply(otherEvents, allOtherEvents);
      [].push.apply(hostedEvents, myHostedEventsInfo);
    }
  }

})();
