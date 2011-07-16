# Geocoder

####Installation:

    npm install geocoder

#### Usage

You can pass a string representation of a location and a callback function to `geocoder.geocode`. It will accept anything that Google will accept: cities, streets, countries, etc.

####Example:

```javascript
var geocoder = require('geocoder');

// Geocoding
geocoder.geocode("Atlanta, GA", function (data) {
  console.log(data);
});

// Reverse Geocoding
geo.reverseGeocode( 33.7489, -84.3789, function (data) {
  console.log(data);
});
```

Results will look like standard [Google JSON Output](http://code.google.com/apis/maps/documentation/geocoding/#JSON)

## Roadmap
- Error handling
