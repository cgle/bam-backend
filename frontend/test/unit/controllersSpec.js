'use strict';

/* jasmine specs for controllers go here */

describe('EventsListCtrl', function(){

beforeEach(module('bamApp'));

it('should create "events" model with 3 events', inject(function($controller) {
  var scope = {},
      ctrl = $controller('EventsListCtrl', {$scope:scope});

  expect(scope.events.length).toBe(3);
}));

});