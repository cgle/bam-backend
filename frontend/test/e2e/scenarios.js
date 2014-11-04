'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Bam!', function() {

	describe('Events List View', function() {

		beforeEach(function() {
		browser.get('index.html');
		});

		it('should filter the events list as a user types into the search box', function() {
			var eventsList = element.all(by.repeater('event in events'));
			var query = element(by.model('query'));

			expect(eventsList.count()).toBe(3);

			query.sendKeys('Turck');
			expect(eventsList.count()).toBe(1);

			query.clear();
			query.sendKeys('Party');
			expect(eventsList.count()).toBe(2);
		});

		it('should display the current filter value in the title bar', function() {
			var query = element(by.model('query'));

		  query.clear();
		  expect(browser.getTitle()).toMatch(/Bam!:\s*$/);

		  query.sendKeys('Party');
		  expect(browser.getTitle()).toMatch(/Bam!: Party$/);
		});

		it('should be possible to control event order via the drop down select box', function(){
			var eventNameColumn = element.all(by.repeater('event in events').column('event.name'));
			var query = element(by.model('query'));
			
			function getNames() {
		    return eventNameColumn.map(function(elm) {
		      return elm.getText();
		    });
		  }
		  
		  query.sendKeys('Party'); //let's narrow the dataset to make the test assertions shorter

		  expect(getNames()).toEqual([
		    "Turck 2 Progressive",
		    "Dollhouse Rager Party"
		  ]);

		  element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

		  expect(getNames()).toEqual([
		    "Dollhouse Rager Party",
		    "Turck 2 Progressive"
		  ]);
		});
	});
});
