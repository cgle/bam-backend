var eventApp = angular.module('eventApp', ['ngRoute', 'eventControllers', 'ngResource']);

eventApp.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
			when('/events', {
				templateUrl: '/eventTest.html',
				controller: 'eventsController'
			});
		}]);