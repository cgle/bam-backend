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
		when('/events/:eventId', {
			controller: 'EventDetailController',
			templateUrl: 'views/eventView.html'
		}).
		when('/user/:userId', {
			controller: 'UserController',
			templateUrl: "userView.html"
		}).
		when('/user/edit', {
			controller: 'UserEditController',
			templateUrl: "userInfo_form.html"
		}).
		when('/user/events', {
			controller: 'UserController',
			templateUrl: 'event_view.html'
		}).
		when('/user/friends', {
			controller: 'UserController',
			templateUrl: 'friends_view.html'
		});

});