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
geocoder.reverseGeocode( 33.7489, -84.3789, function (data) {
  console.log(data);
});
```

Results will look like standard [Google JSON Output](http://code.google.com/apis/maps/documentation/geocoding/#JSON)

You can pass in an optional options hash as a last argument, useful for setting sensor to true (it defaults to false).

## Roadmap
- Error handling

## Further Reading
- [Blog post](http://blog.stephenwyattbush.com/2011/07/16/geocoding-with-nodejs/)
