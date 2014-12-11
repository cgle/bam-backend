var authModule = angular.module('authModule', []);

authModule.factory('AuthService', ['$http', function($http) {

	var currentUser;
	var userAccessToken;

	return {
		login: function(username, password) {
			
			var credentials = {
				username : username,
				password : password
			};

			var responsePromise = $http.post('/api/authenticate/login', credentials, {});
		    responsePromise.success(function(data) {
		      console.log(data);
		      console.log('login success');
		      currentUser = data.user;
		      userAccessToken = data.access_token;
		    });
		    responsePromise.error(function(){
		      console.log('login error');
		    });
		},
		isLoggedin: function() { },
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
			return currentUser; 
		}
	}
	
}]);