'use strict';

/* Controllers */
var eventControllers = angular.module('eventControllers', []);

eventControllers.controller('EventDetailController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    console.log($routeParams);
    $http.get('api/events/' + $routeParams.eventId).success(function(data) {
      $scope.event = data.data[0];
      console.log(data.data[0]);
    });
  }]);

eventControllers.controller('EventListController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('api/events').success(function(data) {
      $scope.events = data.data;
      console.log(data.data);
    });
  }]);

eventControllers.controller("EventFormController", ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.eventForm={};
    $scope.eventForm.privacy = "public";
    $scope.eventForm.createEvent = function(item, event) {
      console.log("SUBMITTING");
      var newEvent = {
        name : $scope.eventForm.name,
        address : $scope.eventForm.address,
        description : $scope.eventForm.description,
        privacy : $scope.eventForm.privacy,
        date : $scope.eventForm.date,
        category : [$scope.eventForm.categories]
      };
      var responsePromise = $http.post("/api/events", newEvent, {});
      responsePromise.success(function(data, status, headers, config){
        console.log('success');
        console.log(data.data._id);
        $location.path('/events/' + data.data._id)
      });
      responsePromise.error(function(data, status, headers, config){
        console.log("error");
      });
    }
}]);



// bamApp.controller('eventsController', function($scope, eventsFactory) {
//   eventsFactory.getEventsAsync(function(results) {
//     console.log('events value returned');
//     console.log(results.data)
//     $scope.events = results.data;
//   });
// });

// bamApp.factory('EventTestFactory', function($resouce) {
//   return $resource("/api/events/:event_id");
// });

// bamApp.controller('testResourceController', function($scope, EventTestFactory) {
//   var entry = EventTestFactory.get({ id: $scope.id }, function() {
//     console.log(entry);
//   });
// });


// eventControllers.controller('eventsController', function($scope, eventsFactory) {
//   eventsFactory.getEventsAsync(function(results) {
//     console.log('events value returned');
//     console.log(results.data)
//     $scope.events = results.data;
//   });
// });

// eventControllers.factory('eventsFactory', function($http) {
//   return {
//     getEventsAsync: function(callback) {
//       $http.get('/api/events').success(callback);
//     }
//   };
// });

// eventControllers.factory('EventTestFactory', function($resource) {
//   return $resource("/api/events/:event_id");
// });

// eventControllers.controller('testResourceController',function($scope, EventTestFactory) {
//   var entry = EventTestFactory.get({ id: $scope.id }, function() {
//     console.log(">>>>", entry);
//   });
// });

