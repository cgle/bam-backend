$(function() {
	var $container = $('.event-group').isotope({
		itemSelector: '.event-item',
		getSortData: {
			number: '.number parseInt'
		}
	});

	$('.mini-navigation-menu').on('click', 'button', function() {
		var sortByValue = $(this).attr('data-sort-by');
		$container.isotope({sortBy: sortByValue});
	});

	// bind filter button click
	$('.mini-navigation-menu').on( 'click', 'button', function() {
		var filterValue = $(this).attr('data-filter');
		$container.isotope({filter: filterValue});
	});
});

