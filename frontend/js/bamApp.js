'use strict';

var bamApp = angular.module('bamApp', ['ngRoute', 'eventControllers', 'ngResource']);

bamApp.config(function($routeProvider) {

	$routeProvider.
		when('/events', {
			controller: 'eventsController',
			templateUrl: 'views/eventTest.html'
		}).
		when('/events/new', {
			controller:'EventFormController',
			templateUrl:'views/eventForm.html'
		}).
		when('/events/:eventId', {
			controller: 'EventDetailController',
			templateUrl: 'views/eventTest.html'
		}).
		when('/user', {
			controller: 'UserController',
			templateUrl: "user_Test.html"
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