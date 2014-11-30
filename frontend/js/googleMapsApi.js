console.log('google maps might be working?');

var placeSearch, autocomplete;


function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  autocomplete = new google.maps.places.Autocomplete((document.getElementById('googleAddress')),
      { types: ['geocode'] });

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    console.log(">>>>", $('#googleAddress').val());
    $('#googleAddress').val(fillInAddress()).change();
  });
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&' +
      'callback=initialize';
  document.body.appendChild(script);
  console.log('load script called');
}

function fillInAddress(){
  var place = autocomplete.getPlace();
  console.log(place.formatted_address);
  return place.formatted_address;
}

window.onload = loadScript();


