# Geocoder

###Installation:

    npm install geocoder

### Usage

You can pass a string representation of a location and a callback function to `geocoder.geocode`. It will accept anything that Google will accept: cities, streets, countries, etc.

###Example:

```javascript
var geocoder = require('geocoder');

// Geocoding
geocoder.geocode("Atlanta, GA", function ( err, data ) {
  // do something with data
});

// Reverse Geocoding
geocoder.reverseGeocode( 33.7489, -84.3789, function ( err, data ) {
  // do something with data
});

// Setting sensor to true
geocoder.reverseGeocode( 33.7489, -84.3789, function ( err, data ) {
  // do something with data
}, { sensor: true });

// Setting language to German
geocoder.reverseGeocode( 33.7489, -84.3789, function ( err, data ) {
  // do something with data
}, { language: 'de' });


// Selecting another provider to do reverse geocoding
// Currently only geonames and yahoo placefinder are supported
geocoder.selectProvider("geonames",{"username":"demo"});

// Output will be roughly in the same format as Google's
geocoder.reverseGeocode( 33.7489, -84.3789, function ( err, data ) {
  // do something with data
});

// see http://developer.yahoo.com/geo/placefinder/guide/index.html
geocoder.selectProvider("yahoo",{"appid":"xxx"});

// Output will be roughly in the same format as Google's
geocoder.reverseGeocode( 33.7489, -84.3789, function ( err, data ) {
  // do something with data
});





```

Results will look like standard [Google JSON Output](http://code.google.com/apis/maps/documentation/geocoding/#JSON)

You can pass in an optional options hash as a last argument, useful for setting sensor to true (it defaults to false) and the language (default is empty which means that google geocoder will guess it by geo ip data). For details see the [Google Geocoding API Docs](http://code.google.com/intl/en-US/apis/maps/documentation/geocoding/#GeocodingRequests)

###Testing:
`nodeunit test`

## Roadmap
- Complete Test Suite
- Better options handling

## Further Reading
- [Blog post](http://blog.stephenwyattbush.com/2011/07/16/geocoding-with-nodejs/)
