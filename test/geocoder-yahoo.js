geocoder = require('../index.js');



module.exports = {

  setUp:function(cb) {
    geocoder.selectProvider("yahoo",{"appid":"[yourappidhere]"});
    cb();
  },

  testExposeGeocodeFunction: function(test){
    test.equal(typeof geocoder.geocode, 'function');
    test.equal(geocoder.provider, 'yahoo');
    test.done()
  },

  testReverseGeocode: function(test){
    return require('./geocoder-google-test.js').testReverseGeocode(test);
  },

  testReverseGeocodeGoogleplex: function(test){
    return require('./geocoder-google-test.js').testReverseGeocodeGoogleplex(test);
  },

}
