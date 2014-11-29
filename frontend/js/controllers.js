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



eventControllers.factory('UserData', function(){
  var UserData = {firstName:"Rhyan", lastName:"Foo Kune", email:"rfookune@macalester.edu", birthdate:"12/30/1992", userDescription:"Lorem ipsum dolor sit amet, vis cu sale suscipit. Ne sed dictas maiorum consequat. Per id wisi civibus. Pro id oportere consequat, eros aliquip eu eos, ex liber saepe perfecto est. At affert discere qui. Eligendi partiendo sententiae cu pri, suas erat qui id. Ex eam iuvaret denique, ignota similique vim te. Elit velit constituto id ius, ne mea viris inimicus omittantur. No vis principes aliquando definitionem, alii sint solum ad has, eum facer nusquam democritum ut. Eum eu tota efficiendi."};
  return UserData;
})

eventControllers.controller("UserEditController", ['$scope', '$location', 'UserData', '$filter', function($scope, $location, UserData, $filter){
  window.scope = $scope;
  $scope.credentials = { firstName:"", lastName:"", email:"", birthdate:"", userDescription:""};
  window.data = UserData;
  // $scope.dateAsString = $filter('birthdate')($scope.dateAsString, 'yyyy-MM-dd');

  $scope.saveChanges = function() {

    UserData.firstName = $scope.credentials.firstName;
    UserData.lastName = $scope.credentials.lastName;
    UserData.email = $scope.credentials.email;
    UserData.userDescription = $scope.credentials.userDescription;
    
    $location.path('/user');

  }
}]);

eventControllers.controller("UserController", ['$scope', '$location', 'UserData', function($scope, $location, UserData){
  window.scope = $scope;
  window.scope = UserData;
  $scope.firstName = UserData.firstName;
  $scope.lastName = UserData.lastName;
  $scope.email = UserData.email;
  // $scope.birthdate = UserData.birthdate
  $scope.userDescription = UserData.userDescription;

  $scope.edit = function() {
    $location.path('/user/edit')
  }

  $scope.userPage = function() {
    $location.path('/user')
  }

  $scope.userEvents = function() {
    $location.path('/user/events')
  }

  $scope.userFriends = function() {
    $location.path('/user/friends')
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

