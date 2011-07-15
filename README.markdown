# Geocoder

Installation:

    npm install geocoder

Example:

```javascript
var geo = require('geocoder');

console.log("You are using geocoder version: " + geo.version);

geo.geocoder.geocode("Atlanta, GA", function (r) {
  console.log(r);
});
```

Produces:

    You are using geocoder version 0.0.2
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
