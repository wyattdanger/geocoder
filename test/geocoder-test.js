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

  testReverseGeocode: function(test){
    test.expect(3);
    geocoder.reverseGeocode(49.101,6.1442, function(err, result){
      test.ok(!err);
      test.equals('OK', result.status);
      test.ok(result.results[0].formatted_address.match(/Montigny-lès-Metz/));
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
