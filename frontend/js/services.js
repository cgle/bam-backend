var authModule = angular.module('authModule', []);

authModule.factory('AuthService', ['$http', function($http) {

	var currentUser;

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
		    });
		    responsePromise.error(function(){
		      console.log('login error');
		    });
		},
		isLoggedin: function() { },
		logout: function() { },
		currentUser: function() { 
			console.log('wtf');
			return currentUser; 
		}
	}
	
}]);