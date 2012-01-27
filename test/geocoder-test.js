geocoder = require('../index.js');

module.exports = {
  testExposeGeocodeFunction: function(test){
    test.equal(typeof geocoder.geocode, 'function');
    test.done()
  },

  testGeocode: function(test){
    test.expect(3);
    geocoder.geocode("Plattlinger Str. 10, 81479 Munich, Germany", function(err, result){
      test.ok(!err);
      test.equals('OK', result.status);
      test.ok(result.results[0].formatted_address.match(/Munich/));
      test.done();
    });
  },

  testLanguage: function(test){
    test.expect(3);
    geocoder.geocode("Plattlinger Str. 10, 81479 München, Deutschland", function(err, result){
      test.ok(!err);
      test.equals('OK', result.status);
      test.ok(result.results[0].formatted_address.match(/München/));
      test.done();
    }, {language: 'de'});
  }
}
