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

eventControllers.controller('EventCategoriesController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $scope.events = [];
    console.log("ROUTE PARAM>>", $routeParams);
    $http.get('api/events').success(function(data) {
      data.data.forEach(function(event){
        console.log("EVENT>>", event);
        if ($.inArray($routeParams.category, event.categories) > -1){
          $scope.events.push(event);
        }
      });
    });
  }]);

eventControllers.controller("EventFormController", ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.eventForm={};
    $scope.eventForm.privacy = true;
    $scope.eventForm.name = ' Event Name'
    $scope.eventForm.address = ' Location'
    $scope.eventForm.createEvent = function(item, event) {
      console.log("SUBMITTING");
      var newEvent = {
        name : $scope.eventForm.name,
        address : $scope.eventForm.address,
        description : $scope.eventForm.description,
        public : $scope.eventForm.privacy,
        date : $scope.eventForm.date,
        categories : $scope.eventForm.category
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

var userControllers = angular.module('userControllers', []);

eventControllers.factory('UserData', function(){
  var UserData = {firstName:"Rhyan", lastName:"Foo Kune", email:"rfookune@macalester.edu", birthdate:"12/30/1992", userDescription:"Lorem ipsum dolor sit amet, vis cu sale suscipit. Ne sed dictas maiorum consequat. Per id wisi civibus. Pro id oportere consequat, eros aliquip eu eos, ex liber saepe perfecto est. At affert discere qui. Eligendi partiendo sententiae cu pri, suas erat qui id. Ex eam iuvaret denique, ignota similique vim te. Elit velit constituto id ius, ne mea viris inimicus omittantur. No vis principes aliquando definitionem, alii sint solum ad has, eum facer nusquam democritum ut. Eum eu tota efficiendi."};
  return UserData;
})

userControllers.controller("UserEditController", ['$scope', '$location', 'UserData', '$filter', function($scope, $location, UserData, $filter){
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

userControllers.controller("UserEditController", ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $scope.credentials = {};
    $http.get('api/users/' + $routeParams.userId).success(function(data) {
      console.log(data.data[0]);
      $scope.credentials.username = data.data[0].username;
      $scope.credentials.email = data.data[0].email;
      $scope.credentials.birthdate = data.data[0].birthyear;
    });
  }]);

userControllers.controller('UserController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    console.log($routeParams);
    $http.get('api/users/' + $routeParams.userId).success(function(data) {
      $scope.user = data.data[0];
      console.log(data.data[0]);
    });
  }]);



// userControllers.controller("UserController", ['$scope', '$location', 'UserData', function($scope, $location, UserData){
//   window.scope = $scope;
//   window.scope = UserData;
//   $scope.firstName = UserData.firstName;
//   $scope.lastName = UserData.lastName;
//   $scope.email = UserData.email;
//   // $scope.birthdate = UserData.birthdate
//   $scope.userDescription = UserData.userDescription;

//   $scope.edit = function() {
//     $location.path('/user/edit')
//   }

//   $scope.userPage = function() {
//     $location.path('/user')
//   }

//   $scope.userEvents = function() {
//     $location.path('/user/events')
//   }

//   $scope.userFriends = function() {
//     $location.path('/user/friends')
//   }


// }]);


