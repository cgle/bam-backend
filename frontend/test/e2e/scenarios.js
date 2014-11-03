'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Bam!', function() {

	describe('Events List View', function() {

		beforeEach(function() {
		browser.get('index.html');
		});
		
		var eventsList = element.all(by.repeater('event in events'));
		var query = element(by.model('query'));

		it('should filter the events list as a user types into the search box', function() {

		expect(eventsList.count()).toBe(3);

		query.sendKeys('Turck');
		expect(eventsList.count()).toBe(1);

		query.clear();
		query.sendKeys('Party');
		expect(eventsList.count()).toBe(2);
		});

		it('should display the current filter value in the title bar', function() {
		  query.clear();
		  expect(browser.getTitle()).toMatch(/Bam!:\s*$/);

		  query.sendKeys('Party');
		  expect(browser.getTitle()).toMatch(/Bam!: Party$/);
		});
	});
});
