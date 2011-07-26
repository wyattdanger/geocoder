var vows = require('vows'),
    assert = require('assert'),
    geocoder = require('../index.js');


vows.describe('Geocoder public interface').addBatch({
    'after requiring geocoder': {
        topic: geocoder,
        'geocoder exposes a geocode method': function (topic) {
            assert.equal(typeof geocoder.geocode, 'function');
        },
        'geocoder exposes a reverseGeocode method': function (topic) {
            assert.equal(typeof geocoder.reverseGeocode, 'function');
        }
    }
}).run();
