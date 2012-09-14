geocoder = require('../index.js');



module.exports = {

  setUp:function(cb) {
    geocoder.selectProvider("google");
    cb()
  },

  testExposeGeocodeFunction: function(test){
    test.equal(typeof geocoder.geocode, 'function');
    test.equal(geocoder.provider, 'google');
    test.done()
  },

  testGeocode: function(test){
    test.expect(3);
    geocoder.geocode("Munich, Germany", function(err, result){
      test.ok(!err);
      test.equals('OK', result.status);
      test.ok(result.results[0].formatted_address.match(/Munich/));
      test.done();
    });
  },

  testReverseGeocode: function(test){
    test.expect(7);
    geocoder.reverseGeocode(49.101,6.1442, function(err, result){
      test.ok(!err);
      test.equals('OK', result.status);
      // console.error(result.results[0].formatted_address);
      test.ok(result.results[0].formatted_address.match(/Montigny-lès-Metz/i));
      result.results[0].address_components.forEach(function(ac) {
        if (ac.types.indexOf("locality")>=0) {
          test.ok(ac.short_name.match(/^Montigny-lès-Metz$/i));
        }
        if (ac.types.indexOf("country")>=0) {
          test.equals(ac.short_name,"FR");
          test.equals(ac.long_name,"France");
        }
        if (ac.types.indexOf("administrative_area_level_1")>=0) {
          test.equals(ac.short_name,"Lorraine");
        }
      });
      test.done();
    });
  },

  testReverseGeocodeGoogleplex: function(test){
    test.expect(9);
    geocoder.reverseGeocode(37.42291810, -122.08542120, function(err, result){
      test.ok(!err);
      test.equals('OK', result.status);
      test.ok(result.results[0].formatted_address.match(/Mountain View/i));
      result.results[0].address_components.forEach(function(ac) {
        if (ac.types.indexOf("locality")>=0) {
          test.equals(ac.short_name,"Mountain View");
        }
        if (ac.types.indexOf("country")>=0) {
          test.equals(ac.short_name,"US");
          test.equals(ac.long_name,"United States");
        }
        if (ac.types.indexOf("route")>=0) {
          test.ok(ac.short_name.match(/^Amphitheatre Pk(w?)y$/i));
        }
        if (ac.types.indexOf("administrative_area_level_1")>=0) {
          test.equals(ac.short_name,"CA");
          test.equals(ac.long_name,"California");
        }
      });
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
