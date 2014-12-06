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

eventControllers.controller("EventEditController", ['$scope', '$http', '$location', '$routeParams',
  function($scope, $http, $location, $routeParams) {
    $scope.eventForm = {}
    console.log($routeParams);
    $http.get('api/events/' + $routeParams.eventId).
      success(function(data) {
        console.log("event data>>", data);
        $scope.eventForm.name = data.data[0].name;
        $scope.eventForm.address = data.data[0].address;
        $scope.eventForm.date = data.data[0].date;
        $scope.eventForm.privacy = data.data[0].public;
        $scope.eventForm.description = data.data[0].description;
        $scope.eventForm.category = data.data[0].categories;
    }).
      error(function(data) {
        console.log('Could not edit event info');
      });
    $scope.eventForm.updateEvent = function(){
      console.log("SUBMITTING");
      var editEvent = {
        name : $scope.eventForm.name,
        address : $scope.eventForm.address,
        date : $scope.eventForm.date,
        public : $scope.eventForm.description,
        description : $scope.eventForm.description,
        categories : $scope.eventForm.category
      }

      var responsePromise = $http.put("/api/events/" + $routeParams.eventId, editEvent, {});
      responsePromise.
        success(function(data) {
          console.log("success");
          $location.path('/events/' + $routeParams.eventId);
        }).
        error(function(data) {
          console.log("Failed to update event info");
        });
    }
  }]);

var voteControllers = angular.module('voteControllers', []);

voteControllers.controller("EventVoteController", ['$scope', '$http',
  function($scope, $http) {
    $scope.eventVote = function() {
      console.log("VOTED");
    }
  }]);

var userControllers = angular.module('userControllers', []);

// userControllers.factory('UserData', function(){
//   var UserData = {firstName:"Rhyan", lastName:"Foo Kune", email:"rfookune@macalester.edu", birthdate:"12/30/1992", userDescription:"Lorem ipsum dolor sit amet, vis cu sale suscipit. Ne sed dictas maiorum consequat. Per id wisi civibus. Pro id oportere consequat, eros aliquip eu eos, ex liber saepe perfecto est. At affert discere qui. Eligendi partiendo sententiae cu pri, suas erat qui id. Ex eam iuvaret denique, ignota similique vim te. Elit velit constituto id ius, ne mea viris inimicus omittantur. No vis principes aliquando definitionem, alii sint solum ad has, eum facer nusquam democritum ut. Eum eu tota efficiendi."};
//   return UserData;
// })


// Keep a global instance of the user's id so we don't have to get it from the db each time
userControllers.factory('User_ID', function(){
  var User_ID = {id: "your mama"};
  return User_ID;
})


userControllers.controller("UserEditController", ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    var userId;
    $scope.userForm = {};
    $http.get('api/users/' + $routeParams.userId).
      success(function(data) {
        console.log(data.data[0]._id);
        userId = data.data[0]._id;
        $scope.userForm.firstname = data.data[0].firstname; 
        $scope.userForm.lastname = data.data[0].lastname;
        $scope.userForm.username = data.data[0].username;
        $scope.userForm.email = data.data[0].email;
        $scope.userForm.birthdate = data.data[0].birthyear;
        $scope.userForm.userDescription = data.data[0].description;
      }).
        error(function(data) {
          console.log("Could not edit user info");
        });
    $scope.submitEdit = function(item, event) {
      console.log("SUBMITTING");
      console.log(userId);
      var editUser = {
        firstname : $scope.userForm.firstName,
        lastname : $scope.userForm.lastName,
        username : $scope.userForm.userName,
        email : $scope.userForm.email,
        description : $scope.userForm.userDescription,
        birthyear : $scope.userForm.birthdate
      };
      var responsePromise = $http.put("/api/users/" + userId, editUser, {});
      responsePromise.success(function(data, status, headers, config){
        console.log('success');
        console.log("THIS>>", data);
        $location.path('/user/' + userId);
      });
      responsePromise.error(function(data, status, headers, config){
        console.log("error");
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


var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginSubmitController', ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    var email;
    var password;
    
    // stores location information
    var c = function(pos){
      var lat = pos.coords.latitude,
          long = pos.coords.longitude,
          coords = lat + ', ' + long;
          console.log(coords);
    }

    // Handle getting location errors 
    var showError = function(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.")
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.")
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.")
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.")
          break;
      }
  }

    $scope.submitLogin = function() {
      // Get location of user
      navigator.geolocation.getCurrentPosition(c, showError);
      

      email = $scope.loginForm.email;
      password = $scope.loginForm.password;
      console.log(email);
      console.log(password);
      // add ajax post code to authenticate user here !!!
    }
    $scope.registerLink = function(){
      $location.path('register')
    }
}])

loginControllers.controller('registerController', ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    var email, username, firstname, lastname, password1, password2;
    $scope.submitRegister = function() {
      firstname = $scope.registerForm.firstname;
      lastname = $scope.registerForm.lastname;
      username = $scope.registerForm.username;
      email = $scope.registerForm.email;
      password1 = $scope.registerForm.password1;
      password2 = $scope.registerForm.password2;

      if (password1 !== password2){
        alert("password do not match");
      } else {
        console.log(firstname);
        console.log(lastname);
        console.log(username);
        console.log(email);
        console.log(password1);
        console.log(password2);
      }
      // add ajax post code to register user here !!!
    }
}])