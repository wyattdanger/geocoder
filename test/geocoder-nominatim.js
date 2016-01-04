geocoder = require('../index.js');



module.exports = {

  setUp:function(cb) {
    geocoder.selectProvider("nominatim",{"username":"npmunittests"});
    cb();
  },

  testExposeGeocodeFunction: function(test){
    test.equal(typeof geocoder.geocode, 'function');
    test.equal(geocoder.provider, 'nominatim');
    test.done()
  },

  // Uses "nominatim"
  testReverseGeocode: function(test){
    return require('./geocoder-google-test.js').testReverseGeocode(test);
  },

  // Uses "address"
  /*testReverseGeocodeGoogleplex: function(test){
    return require('./geocoder-google-test.js').testReverseGeocodeGoogleplex(test);
  },
*/
}
