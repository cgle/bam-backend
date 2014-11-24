function getEventWithId(event_id) {
	$.ajax({
		url: '/api/events/' + event_id, 
		type: 'get',
		success: function(data) {
		    //success callback
		},
		error: function(err) {
		    //error callback
		}
	});
}