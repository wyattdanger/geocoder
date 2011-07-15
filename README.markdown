# Geocoder

####Installation:

    npm install geocoder

#### Usage

You can pass a string representation of a location and a callback function to `geocoder.geocode`. It will accept anything that Google will accept: cities, streets, countries, etc.

####Example:

```javascript
var geocoder = require('geocoder');

console.log("You are using geocoder version: " + geocoder.version);

geocoder.geocode("Atlanta, GA", function (r) {
  console.log(r);
});
```

#### Example Produces:

    You are using geocoder version 0.0.3
    { results: 
      [ { address_components: [Object],
        formatted_address: 'Atlanta, GA, USA',
        geometry: [Object],
        types: [Object] } ],
      status: 'OK' }

Results will look like standard [Google JSON Output](http://code.google.com/apis/maps/documentation/geocoding/#JSON)

## Roadmap
- Reverse Geocoding
- Error handling
