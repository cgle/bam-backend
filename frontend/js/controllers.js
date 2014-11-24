'use strict';

/* Controllers */

var bamApp = angular.module('bamApp', []);

var eventControllers = angular.module('eventControllers', []);

bamApp.controller('EventsListCtrl', ['$scope',
  function($scope) {
  	$scope.events = [
  		{'name':'Turck 2 Progressive',
  		 'snippet':'Party woohoo!',
       'date':'2003Mar20',
  		 'age':2},
  		{'name': 'Dollhouse Rager Party',
       'snippet': 'Cuong is doing a keg stand.',
       'date':'1999Jan3',
       'age':3},
      {'name': 'Leonard Center Basketball',
       'snippet': 'We hooping at the LC at 7 pm come through.',
       'date':'2014Nov3',
       'age':1}
    ];
    $scope.orderProp = 'age';
}]);

<<<<<<< HEAD

bamApp.controller('eventsController', function($scope, eventsFactory) {
  eventsFactory.getEventsAsync(function(results) {
    console.log('events value returned');
    console.log(results.data)
    $scope.events = results.data;
  });
});

bamApp.factory('eventsFactory', function($http) {
  return {
    getEventsAsync: function(callback) {
      $http.get('/api/events').success(callback);
    }
  };
});

bamApp.factory('EventTestFactory', function($resouce) {
  return $resource("/api/events/:event_id");
});

bamApp.controller('testResourceController', function($scope, EventTestFactory) {
  var entry = EventTestFactory.get({ id: $scope.id }, function() {
    console.log(entry);
  });
});


eventControllers.controller('eventsController', function($scope, eventsFactory) {
  eventsFactory.getEventsAsync(function(results) {
    console.log('events value returned');
    console.log(results.data)
    $scope.events = results.data;
  });
});

eventControllers.factory('eventsFactory', function($http) {
  return {
    getEventsAsync: function(callback) {
      $http.get('/api/events').success(callback);
    }
  };
});

eventControllers.factory('EventTestFactory', function($resource) {
  return $resource("/api/events/:event_id");
});

eventControllers.controller('testResourceController', function($scope, EventTestFactory) {
  var entry = EventTestFactory.get({ id: $scope.id }, function() {
    console.log(entry);
  });
});



bamApp.controller('UpdateController', ['$scope', function($scope){
  $scope.master = {firstName: "John", lastName: "Doe"};
}])

