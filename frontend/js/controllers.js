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

// userControllers.factory('UserData', function(){
//   var UserData = {firstName:"Rhyan", lastName:"Foo Kune", email:"rfookune@macalester.edu", birthdate:"12/30/1992", userDescription:"Lorem ipsum dolor sit amet, vis cu sale suscipit. Ne sed dictas maiorum consequat. Per id wisi civibus. Pro id oportere consequat, eros aliquip eu eos, ex liber saepe perfecto est. At affert discere qui. Eligendi partiendo sententiae cu pri, suas erat qui id. Ex eam iuvaret denique, ignota similique vim te. Elit velit constituto id ius, ne mea viris inimicus omittantur. No vis principes aliquando definitionem, alii sint solum ad has, eum facer nusquam democritum ut. Eum eu tota efficiendi."};
//   return UserData;
// })

// userControllers.controller("UserEditController", ['$scope', '$location', 'UserData', '$filter', function($scope, $location, UserData, $filter){
//   window.scope = $scope;
//   $scope.userForm = { firstName:"", lastName:"", email:"", birthdate:"", userDescription:""};
//   window.data = UserData;
//   // $scope.dateAsString = $filter('birthdate')($scope.dateAsString, 'yyyy-MM-dd');

//   $scope.saveChanges = function() {

//     UserData.firstName = $scope.userForm.firstName;
//     UserData.lastName = $scope.userForm.lastName;
//     UserData.email = $scope.userForm.email;
//     UserData.userDescription = $scope.userForm.userDescription;
    
//     $location.path('/user');

//   }
// }]);


// Keep a global instance of the user's id so we don't have to get it from the db each time
userControllers.factory('User_ID', function(){
  var User_ID = {id: "your mama"};
  return User_ID;
})


userControllers.controller("UserEditController", ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    var userId;
    $scope.userForm = {};
    $http.get('api/users/' + $routeParams.userId).success(function(data) {
      console.log(data.data[0]._id);
      userId = data.data[0]._id;
      $scope.userForm.username = data.data[0].username;
      $scope.userForm.email = data.data[0].email;
      $scope.userForm.birthdate = data.data[0].birthyear;
    });
    $scope.submitEdit = function(item, event) {
      console.log("SUBMITTING");
      console.log(userId);
      var editUser = {
        
      };
      $.ajax({
        url: '/api/users/' + userId,
        type: 'put',
        // headers: {
          
        // }, 
        data: {
          firstName: $scope.userForm.firstName,
          lastName: $scope.userForm.lastName,
          username : $scope.userForm.username,
          email : $scope.userForm.email,
          description : $scope.userForm.description,
          birthdate : $scope.userForm.birthdate,
        },
        success: function(data) {
          console.log("success");
          $location.path('user/' + userId)
        },
        error: function(err) {
          console.log("noooo")
        }
      });
    }


  }]);

userControllers.controller('UserController', ['$scope', '$routeParams', '$http', '$location', 'User_ID',
  function($scope, $routeParams, $http, $location, User_ID) {
    var userId;
    // console.log(User_ID);
    $http.get('api/users/' + $routeParams.userId).success(function(data) {
      $scope.user = data.data[0];
      console.log(data.data[0]);
      userId = data.data[0]._id;
      // User_ID.id = data.data[0]._id;
    });

    // console.log(User_ID.id); 

    $scope.edit = function() {
      $location.path('user/edit/' + userId)
    }

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

// }]);


