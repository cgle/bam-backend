var eventsApp = angular.module("eventsApp", ['ngResource']);

eventsApp.controller('eventsController', function($scope, eventsFactory) {
  eventsFactory.getEventsAsync(function(results) {
    console.log('events value returned');
    console.log(results.data)
    $scope.events = results.data;
  });
});

eventsApp.factory('eventsFactory', function($http) {
  return {
    getEventsAsync: function(callback) {
      $http.get('/api/events').success(callback);
    }
  };
});

eventsApp.factory('EventTestFactory', function($resource) {
  return $resource("/api/events/:event_id");
});

eventsApp.controller('testResourceController', function($scope, EventTestFactory) {
  var entry = EventTestFactory.get({ id: $scope.id }, function() {
    console.log(entry);
  });
});