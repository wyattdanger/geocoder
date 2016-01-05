geocoder = require('../index.js');



module.exports = {

  setUp:function(cb) {
    geocoder.selectProvider("here",{"appid": "sS9YNh3wSKTMMDlPvpdW", "appcode": "-junJXzl1ASWYAhDvLCfeg"});
    cb()
  },

  testExposeGeocodeFunction: function(test){
    test.equal(typeof geocoder.geocode, 'function');
    test.equal(geocoder.provider, 'here');
    test.done()
  },

  // Uses "here"
  testReverseGeocode: function(test){
    return require('./geocoder-google-test.js').testReverseGeocode(test);
  },

  // Uses "address"
  testReverseGeocodeGoogleplex: function(test){
    return require('./geocoder-google-test.js').testReverseGeocodeGoogleplex(test);
  },

}
