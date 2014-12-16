'use strict';

var bamApp = angular.module('bamApp', ['userControllers', 'eventControllers', 'loginControllers', 'voteControllers',
	'ngRoute', 'ngResource','authModule', 'wu.masonry']);

bamApp.config(function($routeProvider) {

	$routeProvider.
		when('/', {
			controller: 'EventListController',
			templateUrl: 'views/eventListView.html'
		}).
		when('/events', {
			controller: 'EventListController',
			templateUrl: 'views/eventListView.html'
		}).
		when('/events/new', {
			controller:'EventFormController',
			templateUrl:'views/eventForm.html'
		}).
		when('/events/categories/:category', {
			controller: 'EventCategoriesController',
			templateUrl: 'views/eventCategoryListView.html'
		}).
		when('/events/:eventId/edit', {
			controller: 'EventEditController',
			templateUrl: 'views/eventEditForm.html'
		}).
		when('/events/:eventId', {
			controller: 'EventDetailController',
			templateUrl: 'views/eventView.html'
		}).
		when('/user/:userId/edit', {
			controller: 'UserEditController',
			templateUrl: "views/userInfo_form.html"
		}).
		when('/user/events', {
			controller: 'UserController',
			templateUrl: 'views/eventView.html'
		}).
		when('/user/:userId', {
			controller: 'UserController',
			templateUrl: "views/userView.html"
		}).
		when('/register', {
			controller:'registerController',
			templateUrl:'views/register-form.html'
		}).
		when('/uploadtest', {
			controller: 'uploadTestController',
			templateUrl: 'views/uploadtest.html'
		});
}).
run(function($rootScope, $route) {
	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		if (sessionStorage.restorestate == "true") {
	        $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
	        sessionStorage.restorestate = false;
    	}
	});
	window.onbeforeunload = function (event) {
    	$rootScope.$broadcast('savestate');
	};
});
