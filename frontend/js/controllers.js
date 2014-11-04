'use strict';

/* Controllers */
var bamApp = angular.module('bamApp', []);

bamApp.controller('EventsListCtrl', ['$scope', 
  function($scope) {
  	$scope.events = [
  		{'name':'Turck 2 Progressive', 
  		 'snippet':'Party woohoo!',
       'date':'2003Mar20',
  		 'age':2},
  		{'name': 'Dollhouse Rager Party',
       'snippet': 'Cuong is doing a keg stand.',
       'date':'1999Jan3',
       'age':3},
      {'name': 'Leonard Center Basketball',
       'snippet': 'We hooping at the LC at 7 pm come through.',
       'date':'2014Nov3',
       'age':1}
    ];
    $scope.orderProp = 'age';
}]);
