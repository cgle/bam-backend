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

			// var loginPromise = $http.post('/api/authenticate/login', credentials, {}).
			// success(function(data) {
		 //      console.log('login success');
		 //      userService.currentUser.user = data.user;
		 //      userService.currentUser.access_token = data.access_token;
		 //      userService.SaveState();
		 //      deferred.resolve('login success');
		 //    }).
		 //    error(function(data) {
		 //      responsePromise.error(function(){
		 //      console.log('login error');
		 //      deferred.reject('login error');
		 //    });

			promise.then(function(result){
				console.log('login success');
				userService.currentUser.user = result.user;
				userService.currentUser.access_token = result.access_token;
				userService.SaveState();
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
			$.ajax({
			  url: '/api/authenticate/logout',
			  type: 'post',
			  success: function(data) {
			    console.log('logout success');
			  },
			  error: function(err) {
			    console.log('logout error');
			  }
			});
		},
		update_user_location: function() {
			userService.RestoreState();
			if (navigator.geolocation) {
        		navigator.geolocation.getCurrentPosition(function(pos){
        			var lat = pos.coords.latitude,
        				lng = pos.coords.longitude;
    				var current_position = {
				        lng : lng,
				        lat : lat
    				};
    				console.log('pos>',current_position);
    				console.log('user id for location',userService.currentUser.user._id);
    				$.ajax({
    					url: '/api/users/'+userService.currentUser.user._id,
    					type: 'put',
    					data: {
    						current_pos: current_position
    					},
    					success: function(data){
    						console.log('position updated', data);
    					},
    					error: function(){
    						console.log('unable to update location');
    					}
    				});
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
		}
	}
	
}]);

//http://stackoverflow.com/questions/12940974/maintain-model-of-scope-when-changing-between-views-in-angularjs
authModule.factory('userService',['$rootScope', function($rootScope) {
	var service = {

		currentUser: {
			user: {},
			access_token: '' 
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























