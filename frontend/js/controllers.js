'use strict';


/* Controllers */
var eventControllers = angular.module('eventControllers', []);

eventControllers.controller('EventDetailController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    console.log('EventDetailController loaded');
    $http.get('api/events/' + $routeParams.eventId).success(function(data) {
      var date = new Date(data.data[0].date);
      var formattedDate = dateParser(date);
      console.log(formattedDate);
      $scope.event = data.data[0];
      $scope.event.date = formattedDate;
      console.log(data.data[0]);
    });
  }]);

eventControllers.controller('EventListController', ['$scope', '$routeParams', '$http', '$location','userService', '$q',
  function($scope, $routeParams, $http, $location, userService, $q) {
    var userId;
    var userLocation;
    var query_category = '';
    var url = 'api/events';
    userService.RestoreState();
    userId = userService.currentUser.user._id;
    userLocation = userService.currentUser.user.current_pos;
    // console.log(userId);
    // console.log(userLocation);
    console.log('EventsListController loaded');
    $scope.setDimensions = function(event) {
      var netVotes = event.upvotes - event.downvotes;
      if (netVotes < 5) {
        return {width: "200px", height: "200px"}
      }

      else if (5 <= netVotes && netVotes < 10) {
        return {width: "250px", height: "250px"}
      }

      else if (10 <= netVotes && netVotes < 15) {
        return {width: "320px", height: "320px"}
      }

      else if (netVotes > 15) {
        return {width: "380", height: "380px"}
      }

    };


    var $container = $('.container .events');

    $scope.init = function() {
    // $container.masonry({
    //   rowHeight: 300,
    //   isAnimated:true,
    //   itemSelector: '.event-item'
    // });
    };

    // var container = document.querySelector('.events');
    // console.log(container);
    // var msnry = new Masonry(container, {
    //     rowHeight: 1000,
    //     columnWidth: 100,
    //     itemSelector: '.event-item'
    //   });

    // $('event-item').mouseover(function(e) {
    //   console.log(e.target.className);
    //   if (e.target.className == 'event-item') {
    //     $(this).css("opacity", "0.50");
    //   }
    // }).mouseout(function() {
    //     $(this).css("opacity","1.0");
    // })

    if( userService.currentUser.is_logged_in ) {
      $("#createEvent-button").show();
    } else {
      $("#createEvent-button").hide();
    }


    var query_function = function(url) {
      var promise = $http.get(url).success(function(data) {
        $scope.events = data.data;
        $scope.$apply;
        // console.log(data.data[0].categories);
        // console.log(data.data);
      });
    }

    query_function(url);

    $(document).on('mouseover', '.event-item', function(e) {
      var target = $(e.target);
      var footer = target.find('.item-footer');
      $(footer).show();
      e.stopPropagation();
      e.preventDefault();
    })
    $(document).on('mouseleave', '.event-item, .item-title, .item-footer',  function(e) {
      var that = this;
      var target = $(e.target);
      var footer = target.find('.item-footer');
      footer = footer.length == 1 ? footer : ($(that).hasClass('event-item') ? footer :
        ($(that).parent().find('.item-footer').length == 1 ? $(that).parent().find('.item-footer') : that));
      $(footer).hide();
      e.stopPropagation();
      e.preventDefault();
    });


    $('.mini-navigation-menu li a').on('click', function(e) {
      query_category = $(e.target).attr('data-filter');
      if (query_category != '') query_function(url+'?category='+query_category);
      else {
        query_function(url);
      }
      e.stopPropagation();
      e.preventDefault();
    });

    $scope.newEvent = function(){
      $location.path('/events/new');
    }

    $scope.hasVoted = false;
    $scope.voteType;
    $scope.voteId;

    $scope.eventVote = function(voteType, event) {
      $http.get('/api/events/'+event._id+'/votes?user_id='+userId).
      success(function(data){
        console.log("data:" + data);
        // console.log(event.eventId);
        if (data.data.length > 0) {
          $scope.hasVoted = true;
          $scope.voteType = data.data[0].is_upvote;
          $scope.voteId = data.data[0]._id;
        } else {
          $scope.hasVoted = false;
        }
      }).error(function(){
        console.log('error');
      }).then(function() {
      console.log("VOTED ", voteType);
      console.log('voted?', $scope.hasVoted);
      if (!$scope.hasVoted) {
        var vote = {
          event_id : $routeParams.eventId,
          user_id : userId,
          is_upvote: voteType
        }
        var responsePromise = $http.post('/api/events/'+event._id+'/votes', vote, {});
        responsePromise.success(function(){
          console.log('has voted');
          if (voteType) {event.upvotes+=1;}
          else event.downvotes+=1;
        });
        responsePromise.error(function(){
          console.log('error, not able to vote');

        });
        $scope.hasVoted = true;
        $scope.voteType = voteType;
        } else if (voteType != $scope.voteType) {
        // update vote
        $scope.voteType = voteType;
        var newVote = {
          is_upvote : voteType,
          user_id : userId
        }
        $http.put('/api/events/'+event._id+'/votes/'+$scope.voteId,
          newVote, {}).
          success(function(data){
            console.log('updated vote');
            console.log($scope.voteType+" ADOFIJA "+voteType);
            $scope.voteType = voteType;
            if (voteType) {event.upvotes+=1; event.downvotes-=1;}
            else {event.downvotes+=1; event.upvotes-=1;}
          }).error(function(data){
            console.log('failed to update vote');
          });
      }
        else {
        console.log('already voted');
      }
      });
    }

  }]);

eventControllers.controller('EventCategoriesController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    console.log('EventCategoriesController loaded');
    $scope.events = [];
    $http.get('api/events').success(function(data) {
      data.data.forEach(function(event){
        if ($.inArray($routeParams.category, event.categories) > -1){
          $scope.events.push(event);
        }
      });
    });
  }]);

eventControllers.controller("EventFormController", ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    console.log('EventFormController loaded');
    $scope.eventForm={};
    $scope.files = [];
    $('input[name="profile_pic"]').on('change', function(e) {
      $scope.files = e.target.files;
    });
    $scope.eventForm.privacy = true;
    $scope.eventForm.name = ' Event Name'
    $scope.eventForm.address = ' Location'
    $scope.eventForm.submit = function(item, event) {
      console.log("SUBMITTING");
      var dateString = $scope.eventForm.date;
      var date = new Date(dateString);
      var newEvent = {
        name : $scope.eventForm.name,
        address : $scope.eventForm.address,
        description : $scope.eventForm.description,
        public : $scope.eventForm.privacy,
        date : date,
        category : $scope.eventForm.category
      };
      var responsePromise = $http.post("/api/events", newEvent, {});
      responsePromise.success(function(data, status, headers, config){
        console.log('success');
        if ($scope.files.length > 0) {
          var d =  new FormData();
          jQuery.each($('input[name="profile_pic"]')[0].files, function(i, file) {
            d.append('profile_pic', file);
          });
          $.ajax({
            url: '/api/events/' + data.data._id + '/media',
            type: 'post',
            processData: false,
            contentType: false,
            data: d,
            cache: false,
            error: function(error) {
              console.log(error);
            }
          }).done(function() {
            $location.path('/events/' + data.data._id);
            $scope.$apply();
          });
        } else {
          $location.path('/events/' + data.data._id);
        }
      });
      responsePromise.error(function(data, status, headers, config){
        console.log("error");
      });
    }
}]);

eventControllers.controller("EventEditController", ['$scope', '$http', '$location', '$routeParams','$q',
  function($scope, $http, $location, $routeParams, $q) {
    console.log('EventEditController loaded');
    $scope.eventForm = {};
    $scope.files = [];
    $('input[name="profile_pic"]').on('change', function(e) {
      $scope.files = e.target.files;
    });
    var userId;
    var eventAttendants;
    var eventUpvotes;
    var eventDownvotes;
    var eventCohosts;
    var eventDate;

    console.log($routeParams);
    $http.get('api/events/' + $routeParams.eventId).
      success(function(data) {
        console.log("event data>>", data);
        userId = data.data[0].user_id._id;
        console.log("USER", userId);
        eventDate = new Date(data.data[0].date);
        var date = new Date(eventDate);
        console.log(date);
        $scope.event = data.data[0];
        $scope.eventForm.name = data.data[0].name;
        $scope.eventForm.address = data.data[0].address;
        $scope.eventForm.date = date;
        $scope.eventForm.privacy = data.data[0].public;
        $scope.eventForm.description = data.data[0].description;
        $scope.eventForm.category = data.data[0].category;
    }).
      error(function(data) {
        console.log('Could not edit event info');
    });

    //console.log("DATE>>",userId);
    //dateParser($scope.eventForm.date);
    $scope.eventForm.updateEvent = function(){
      console.log("SUBMITTING");
      console.log("EVENT DATE>>", dateParser( eventDate));
      var formatDate = dateParser( eventDate)
      var editEvent = {
        user_id : userId,
        name : $scope.eventForm.name,
        address : $scope.eventForm.address,
        date : formatDate,
        public : $scope.eventForm.description,
        description : $scope.eventForm.description,
        category : $scope.eventForm.category,
      };


      var data = new FormData();
      var promises = [];
      jQuery.each($('input[name="profile_pic"]')[0].files, function(i, file) {
        data.append('profile_pic', file);
      });
      console.log($scope.files.length);
      $scope.putEventPromise = $http.put("/api/events/" + $routeParams.eventId, editEvent, {});

      promises.push($scope.putEventPromise);
      if ($scope.files.length > 0) {
        console.log("adofiadoif");
        $scope.uploadPromise = $.ajax({
            url: '/api/events/' + $routeParams.eventId + '/media',
            type: 'post',
            processData: false,
            contentType: false,
            data: data,
            cache: false
          });
        promises.push($scope.uploadPromise);
      }

      $q.all(promises).then(function(v) {
        $location.path('/events/' + $routeParams.eventId);
      });
    }
  }]);



var voteControllers = angular.module('voteControllers', []);

voteControllers.controller("EventVoteController", ['$scope', '$http', '$routeParams', 'userService',
  function($scope, $http, $routeParams, userService) {
    console.log('EventVoteController loaded');
    var userId;
    $scope.hasVoted = false;
    $scope.voteType;
    $scope.voteId;
    userService.RestoreState();
    userId = userService.currentUser.user._id;

    $http.get('/api/events/'+$routeParams.eventId+'/votes?user_id='+userId).
    success(function(data){
      if (data.data.length > 0) {
        $scope.hasVoted = true;
        $scope.voteType = data.data[0].is_upvote;
        $scope.voteId = data.data[0]._id;
      } else {
        $scope.hasVoted = false;
      }
    }).
    error(function(){
      console.log('error');
    });

    $scope.eventVote = function(voteType) {
      console.log("VOTED ", voteType);
      console.log('voted?', $scope.hasVoted);
      if (!$scope.hasVoted) {
        var vote = {
          event_id : $routeParams.eventId,
          user_id : userId,
          is_upvote: voteType
        }
        var responsePromise = $http.post('/api/events/'+$routeParams.eventId+'/votes', vote, {});
        responsePromise.success(function(){
          console.log('has voted');
        });
        responsePromise.error(function(){
          console.log('error, not able to vote');
        });
        $scope.hasVoted = true;
      } else if (voteType != $scope.voteType) {
        // update vote
        $scope.voteType = voteType;
        var newVote = {
          is_upvote : voteType,
          user_id : userId
        }
        $http.put('/api/events/'+$routeParams.eventId+'/votes/'+$scope.voteId,
          newVote, {}).
          success(function(data){
            console.log('updated vote');
          }).
          error(function(data){
            console.log('failed to update vote');
          });
      }
        else {
        console.log('already voted');
      }
    }
  }]);




var userControllers = angular.module('userControllers', []);

userControllers.controller("HeaderController", ['$scope','userService',
  function($scope, userService) {
    console.log('HeaderController loaded');
    userService.RestoreState();
    $scope.userId = userService.currentUser.user._id;

    if( userService.currentUser.is_logged_in ) {

      $("#userDropdown").show();
      $(".login-button").hide();
      //console.log('user id>>',userId);
      //$scope.user = userService.currentUser.user;
      //$scope.user.fullname = userService.currentUser.user.firstname + ' ' + userService.currentUser.user.lastname;
      //$scope.userId = userId;

    } else {
      $("#userDropdown").hide();
      $(".login-button").show();
    }
  }]);

userControllers.controller("UserEditController", ['$scope', '$routeParams', '$http', '$location', '$q',
  function($scope, $routeParams, $http, $location, $q) {
    console.log('UserEditController loaded');
    var userId;
    $scope.userForm = {};
    $scope.files = [];
    $('input[name="profile_pic"]').on('change', function(e) {
      $scope.files = e.target.files;
    });

    $http.get('api/users/' + $routeParams.userId).
      success(function(data) {
        console.log(data.data[0]._id);
        userId = data.data[0]._id;
        $scope.user = data.data[0];
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
        firstname : $scope.userForm.firstname, //fixed
        lastname : $scope.userForm.lastname,
        username : $scope.userForm.username, //fix cap
        email : $scope.userForm.email,
        description : $scope.userForm.userDescription,
        birthyear : $scope.userForm.birthdate
      };

      var data = new FormData();
      var promises = [];
      jQuery.each($('input[name="profile_pic"]')[0].files, function(i, file) {
        data.append('profile_pic', file);
      });

      $scope.putProfilePromise = $http.put("/api/users/" + userId, editUser, {});
      $scope.uploadPromise = $.ajax({
            url: '/api/users/' + userId + '/media',
            type: 'post',
            processData: false,
            contentType: false,
            data: data,
            cache: false
          });

      promises.push($scope.putProfilePromise);
      if ($scope.files.length > 1) promises.push($scope.uploadPromise);

      $q.all(promises).then(function(v) {
        $location.path('/user/' + userId);
      });
      // responsePromise.success(function(data, status, headers, config){
      //   console.log('success');
      //   console.log("THIS>>", data);
      //   $location.path('/user/' + userId);
      // });
      // responsePromise.error(function(data, status, headers, config){
      //   console.log("error");
      // });
    }

  }]);


userControllers.controller('UserController', ['$scope', '$routeParams', '$http', '$location', 'userService',
  function($scope, $routeParams, $http, $location, userService) {
    var userId;
    var userEvents = [];
    console.log('UserController loaded');

    userService.RestoreState();
    userId = userService.currentUser.user._id;
    if (userId == $routeParams.userId || $routeParams.userId == undefined) {
      console.log(userService.currentUser.is_logged_in);
      if( userService.currentUser.is_logged_in ) {
        $scope.user = userService.currentUser.user;
        $scope.user.fullname = userService.currentUser.user.firstname + ' ' + userService.currentUser.user.lastname;
        $scope.userId = userId;
        console.log($scope.user);
      }
    } else {
      userId = $routeParams.userId;
      $http.get('api/users/' + userId).
        success(function(data) {
          $scope.user = data.data[0];
          $scope.user.fullname = data.data[0].firstname + ' ' + data.data[0].lastname;
          console.log("EVENTS",$scope.user.created_events)
        }).
        error(function(){
          console.log('cannot load user');
        });
    }
    // $scope.userId = userId;
    if( userService.currentUser.is_logged_in ) {
      // console.log(userService.currentUser);
      $scope.user = userService.currentUser.user;
      $scope.user.fullname = userService.currentUser.user.firstname + ' ' + userService.currentUser.user.lastname;
      $scope.userId = userId;
      $("#userDropdown").show();
      $(".login-button").hide();
    } else {
      $("#userDropdown").hide();
      $(".login-button").show();
    }
  }]);



var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginSubmitController', ['$scope', '$routeParams', '$http', '$route', '$location','$q','userService','AuthService',
  function($scope, $routeParams, $http, $route, $location, $q, userService, AuthService) {
    console.log('LoginSubmitController loaded');

    var username;
    var password;

    $scope.submitLogin = function() {
      username = $scope.loginForm.username;
      password = $scope.loginForm.password;
      console.log(username);
      console.log(password);

      AuthService.login(username,password).then(function() {
        console.log('Logged in');
        toastr.success('logged in');
        $(".overlay").removeClass("overlay-open");
        $(".login-button").hide();
        $("#userDropdown").show();
        AuthService.update_user_location().then(function(){
            toastr.info('Updated location');
          }, function() {
            toastr.warning('Unable to update location');
        });
        $route.reload();
        $location.path('/')
      }, function(){
        console.log('error logging in');
        toastr.error('Login error')
      });
    }
    $scope.registerLink = function(){
      $(".overlay").removeClass("overlay-open");
      $location.path('/register')
    }

    $scope.logout = function(){
      AuthService.logout().then(function(){
        $route.reload();
        $location.path('/')
        $("#userDropdown").hide();
        $(".login-button").show();
        AuthService.isLoggedin();
      });
    }
}])

loginControllers.controller('registerController', ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    console.log('registerController loaded');

    var email, username, firstname, lastname, password1, password2, birthyear;

    $scope.submitRegister = function() {
      firstname = $scope.registerForm.firstname;
      lastname = $scope.registerForm.lastname;
      username = $scope.registerForm.username;
      email = $scope.registerForm.email;
      birthyear = $scope.registerForm.birthyear;
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
        console.log(birthyear);

        var submitObject = {
          username: username,
          firstname: firstname,
          lastname: lastname,
          email: email,
          birthyear: birthyear,
          password: password2
        };

        $http.post('/api/authenticate/register', submitObject,{}).
        success(function(data){
          console.log('submit success', data);
          $location.path('/');
        }).
        error(function(){
          console.log('submit error');
        });
      }
    }
}])

// var settingControllers = angular.module('settingControllers', []);
// settingControllers.controller('SettingControllers', ['$scope', '$routeParams']


var testControllers = angular.module('testControllers', []);
// loginControllers.controller('uploadTestController', ['$scope', '$routeParams', '$http', '$location',
//   function($scope, $routeParams, $http, $location) {

// }])

var dateParser = function(date){
  var formattedDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  return formattedDate;
}
