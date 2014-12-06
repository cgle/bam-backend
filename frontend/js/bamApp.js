'use strict';

var bamApp = angular.module('bamApp', ['userControllers', 'eventControllers', 'ngRoute', 'ngResource']);

bamApp.config(function($routeProvider) {

	$routeProvider.
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
		when('/events/edit/:eventId', {
			controller: 'EventEditController',
			templateUrl: 'views/eventEditForm.html'
		}).
		when('/events/:eventId', {
			controller: 'EventDetailController',
			templateUrl: 'views/eventView.html'
		}).
		when('/user/edit/:userId', {
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
		});

});