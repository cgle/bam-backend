var authModule = angular.module('authModule', []);

authModule.factory('AuthService', ['$cookieStore','$http', '$location', function($cookieStore, $http, $location) {

	var currentUserId = $cookieStore.get('currentUserId');
	var userAccessToken = $cookieStore.get('access_token');

	return {
		login: function(username, password) {
			
			var credentials = {
				username : username,
				password : password
			};

			var responsePromise = $http.post('/api/authenticate/login', credentials, {});
		    responsePromise.success(function(data) {
		      console.log('login success');
		      currentUserId = data.user._id;
		      userAccessToken = data.access_token;
		      $cookieStore.put('currentUserId',currentUserId);
		      $cookieStore.put('access_token', userAccessToken);
		    });
		    responsePromise.error(function(){
		      console.log('login error');
		    });
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
			  headers: {
			    "Authorization": "Bearer " + userAccessToken
			  }, 
			  type: 'post',
			  success: function(data) {
			    console.log('logout success');
			  },
			  error: function(err) {
			    console.log('logout error');
			  }
			});
		},
		currentUser: function() { 
			//console.log("CURRENT USER>>", currentUserId);
			return currentUserId; 
		},
		access_token: function() {
			console.log("ACCESS", userAccessToken);
			return userAccessToken;
		},
		update_user_location: function() {
			if (navigator.geolocation) {
        		navigator.geolocation.getCurrentPosition(function(pos){
        			var lat = pos.coords.latitude,
        				lng = pos.coords.longitude;
    				var current_position = {
				        lng : lng,
				        lat : lat
    				};
    				console.log('pos>',current_position);
    				console.log('user id for location',currentUserId);
    				$.ajax({
    					url: '/api/users/'+currentUserId,
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