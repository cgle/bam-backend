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
		}
	}
	
}]);