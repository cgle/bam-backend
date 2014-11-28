// setter
var app = angular.module("bamApp", []).config(function($routeProvider){
	
	$routeProvider.when('/home', {
		templateUrl: 'home.html',
		controller: 'homeController'
	});

	$routeProvider.when('/user_Test', {
		templateUrl: 'user_Test.html',
		controller: 'userController'
	});

	$routeProvider.otherwise({redirectTo : '/home'});
});


// Add controller for index
app.controller('homeController', function(){

});

// Add controller for user
app.controller('userController', function(){

});