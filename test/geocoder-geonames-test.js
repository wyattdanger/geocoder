geocoder = require('../index.js');



module.exports = {

  setUp:function(cb) {
    geocoder.selectProvider("geonames",{"username":"npmunittests"});
    cb();
  },

  testExposeGeocodeFunction: function(test){
    test.equal(typeof geocoder.geocode, 'function');
    test.equal(geocoder.provider, 'geonames');
    test.done()
  },

  // Uses "geonames"
  testReverseGeocode: function(test){
    return require('./geocoder-google-test.js').testReverseGeocode(test);
  },

  // Uses "address"
  testReverseGeocodeGoogleplex: function(test){
    return require('./geocoder-google-test.js').testReverseGeocodeGoogleplex(test);
  },

}
