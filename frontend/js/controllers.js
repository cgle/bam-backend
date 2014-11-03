'use strict';

/* Controllers */
var bamApp = angular.module('bamApp', []);

bamApp.controller('EventsListCtrl', function($scope) {
	$scope.events = [
		{'name':'Turck 2 Progressive', 
			'snippet':'Party woohoo!'},
		{'name': 'Dollhouse Rager Party',
    		'snippet': 'Cuong is doing a keg stand.'},
    	{'name': 'Leonard Center Basketball',
     		'snippet': 'We hooping at the LC at 7 pm come through.'}
    ];
});
