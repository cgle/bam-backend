$(function() {
	var $container = $('.events').isotope({
		itemSelector: '.event-item',
		// getSortData: {
			// number: '.number parseInt'
		// }
	});

	// $('.mini-navigation-menu').on('click', 'button', function() {
		// var sortByValue = $(this).attr('data-sort-by');
		// $container.isotope({sortBy: sortByValue});
	// });

	// // bind filter button click
	$('.mini-navigation-menu').on( 'click', function() {
		var filterValue = $(this).attr('data-filter');
		// console.log(filterValue);
		$container.isotope({filter: filterValue});
	});

	// console.log($('.event-item .upvotes').val());

});

