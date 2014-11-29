console.log('google maps might be working?');

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  autocomplete = new google.maps.places.Autocomplete((document.getElementById('googleAddress')),
      { types: ['geocode'] });
  console.log('initialize working');
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&' +
      'callback=initialize';
  document.body.appendChild(script);
  console.log('load script called');
}

window.onload = loadScript();


