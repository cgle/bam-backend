var authModule = angular.module('authModule', []);

authModule.factory('AuthService', ['$http', '$location', '$q','userService', function($http, $location, $q,userService) {

	return {
		login: function(username, password) {
			
			var defer = $q.defer();
			var promise = defer.promise;


			var credentials = {
				username : username,
				password : password
			};
			
			defer.resolve($http.post('/api/authenticate/login', credentials, {}));

			promise.then(function(result){
				console.log('login success');
				userService.currentUser.user = result.data.user;
				userService.currentUser.access_token = result.data.access_token;
				userService.currentUser.is_logged_in = true;
				userService.SaveState();
				$location.path('/');
			}, function(reason){
				console.log('login error');
			});

		    return defer.promise;
		},
		isLoggedin: function() { 
			$http.get('/api/authenticate/loggedin').
				success(function(data) {
					console.log("success", data);
				}).
				error(function(data) {
					console.log("error");
				});
		},
		logout: function() { 
			var defer = $q.defer()
			var promise = defer.promise;
			userService.RestoreState();
			userService.currentUser.is_logged_in = false;
			userService.SaveState();
			defer.resolve($http.post('/api/authenticate/logout',{},{}));
			return defer.promise;
		},
		update_user_location: function() {

			var defer = $q.defer();
			var promise = defer.promise;

			var current_position;

			userService.RestoreState();

			$http.put('/api/users/'+userService.currentUser.user._id, 
				{ current_pos: current_position }, {});
			if (navigator.geolocation) {
        		navigator.geolocation.getCurrentPosition(function(pos){
        			var lat = pos.coords.latitude,
        				lng = pos.coords.longitude;
    				current_position = {
				        lng : lng,
				        lat : lat
    				};
    				console.log('pos>',current_position);
    				console.log(userService.currentUser);
    				console.log('user id for location',userService.currentUser.user._id);
    				defer.resolve($http.put('/api/users/'+userService.currentUser.user._id, 
				{ current_pos: current_position }, {}));
        		},
        		function(error){
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
        		});
    		} else {
        		console.log('Geolocation not supported');
    		}

    		return defer.promise
		}
	}
	
}]);

//http://stackoverflow.com/questions/12940974/maintain-model-of-scope-when-changing-between-views-in-angularjs
authModule.factory('userService',['$rootScope', function($rootScope) {
	var service = {

		currentUser: {
			user: {},
			access_token: '',
			is_logged_in: false 
		},

		SaveState: function() {
			sessionStorage.userService = angular.toJson(service.currentUser);
		},

		RestoreState: function() {
			service.currentUser = angular.fromJson(sessionStorage.userService);
		}
	}

	$rootScope.$on("savestate", service.SaveState);
	$rootScope.$on("restorestate", service.RestoreState);

	return service;
}]);

// var globalModule = angular.module('globalModule', []);

// globalModule.factorY('singletonService', ['$rootScope'])























