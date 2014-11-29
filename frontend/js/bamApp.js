'use strict';

var bamApp = angular.module('bamApp', ['ngRoute', 'eventControllers', 'ngResource']);

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
		when('/events/:eventId', {
			controller: 'EventDetailController',
			templateUrl: 'views/eventView.html'
		});

});