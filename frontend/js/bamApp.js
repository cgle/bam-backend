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
		});

});